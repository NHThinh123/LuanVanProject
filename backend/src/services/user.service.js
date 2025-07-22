require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const UserFollow = require("../models/user_follow.model");
const User_Interest_Course = require("../models/user_interest_course.model"); // Thêm import
const cloudinary = require("../config/cloudinary");
const { checkUserFollowService } = require("./user_follow.service");
const { addInterestCourseService } = require("./user_interest_course.service");

const createUserService = async (
  email,
  password,
  role,
  bio,
  university_id,
  major_id,
  full_name,
  start_year,
  avatar_url
) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        message: "Email đã tồn tại",
        EC: 1,
      };
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const defaultName =
      full_name || "Người dùng " + Math.floor(100000 + Math.random() * 900000);
    let result = await User.create({
      email,
      password: hashedPassword,
      role: role || "user",
      bio: bio || "",
      university_id,
      major_id,
      full_name: full_name || defaultName,
      start_year: start_year || 2025,
      avatar_url:
        avatar_url ||
        "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg",
    });
    const user = await User.findById(result._id)
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!user) {
      return {
        message: "Tạo tài khoản không thành công",
        EC: 1,
      };
    }

    // Tạo token mới
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
      full_name: user.full_name,
      bio: user.bio,
      start_year: user.start_year,
      major_id: user.major_id,
      university_id: user.university_id,
      avatar_url: user.avatar_url,
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      message: "Tạo tài khoản thành công",
      EC: 0,
      data: result,
      access_token,
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getUsersService = async (query, current_user_id) => {
  try {
    const { email, role, university_id, major_id, full_name, keyword } = query;
    const filter = {};

    if (email) filter.email = { $regex: email, $options: "i" };
    if (role) filter.role = role;
    if (university_id) filter.university_id = university_id;
    if (major_id) filter.major_id = major_id;
    if (keyword) filter.$text = { $search: keyword };

    const users = await User.find(
      filter,
      keyword ? { score: { $meta: "textScore" } } : {}
    )
      .populate("university_id", "university_name")
      .populate("major_id", "major_name")
      .sort(
        keyword
          ? { score: { $meta: "textScore" }, createdAt: -1 }
          : { createdAt: -1 }
      );

    if (!users || users.length === 0) {
      return {
        message: "Không tìm thấy người dùng nào",
        EC: 1,
        data: [],
      };
    }

    // Kiểm tra trạng thái theo dõi, đếm số lượng người theo dõi và lấy khóa học yêu thích
    const usersWithFollowStatus = await Promise.all(
      users.map(async (user) => {
        let isFollowing = false;
        const followersCount = await UserFollow.countDocuments({
          user_follow_id: user._id,
        });
        const interestedCourses = await User_Interest_Course.find({
          user_id: user._id,
        })
          .populate("course_id", "course_name course_code")
          .select("course_id");
        if (current_user_id && user._id.toString() !== current_user_id) {
          const followStatus = await checkUserFollowService(
            current_user_id,
            user._id
          );
          isFollowing =
            followStatus.EC === 0 ? followStatus.data.following : false;
        }
        return {
          ...user._doc,
          isFollowing,
          followers_count: followersCount,
          interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm danh sách khóa học yêu thích
        };
      })
    );

    return {
      message: "Lấy danh sách người dùng thành công",
      EC: 0,
      data: usersWithFollowStatus,
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1, data: [] };
  }
};

const getUserByIdService = async (id, current_user_id) => {
  try {
    let result = await User.findById(id)
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!result) {
      return {
        message: "Người dùng không tồn tại",
        EC: 1,
      };
    }

    // Đếm số lượng người theo dõi và lấy khóa học yêu thích
    const followersCount = await UserFollow.countDocuments({
      user_follow_id: id,
    });
    const interestedCourses = await User_Interest_Course.find({ user_id: id })
      .populate("course_id", "course_name course_code")
      .select("course_id");
    let isFollowing = false;
    if (current_user_id && id.toString() !== current_user_id) {
      const followStatus = await checkUserFollowService(current_user_id, id);
      isFollowing = followStatus.EC === 0 ? followStatus.data.following : false;
    }

    return {
      message: "Lấy thông tin người dùng thành công",
      EC: 0,
      data: {
        ...result._doc,
        followers_count: followersCount,
        isFollowing,
        interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm danh sách khóa học yêu thích
      },
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateUserService = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    // Xử lý danh sách course_ids nếu có
    if (updateData.course_ids && Array.isArray(updateData.course_ids)) {
      const User_Interest_Course = require("../models/user_interest_course.model");
      // Xóa tất cả các khóa học quan tâm hiện tại của người dùng
      await User_Interest_Course.deleteMany({ user_id: id });
      // Thêm lại các khóa học quan tâm mới
      for (const course_id of updateData.course_ids) {
        await addInterestCourseService(id, course_id);
      }
      // Loại bỏ course_ids khỏi updateData để không lưu trực tiếp vào User
      delete updateData.course_ids;
    }

    let result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!result) {
      return {
        message: "Người dùng không tồn tại",
        EC: 1,
      };
    }

    // Lấy danh sách khóa học yêu thích sau khi cập nhật
    const interestedCourses = await User_Interest_Course.find({ user_id: id })
      .populate("course_id", "course_name course_code")
      .select("course_id");

    // Tạo token mới với thông tin cập nhật
    const payload = {
      _id: result._id,
      email: result.email,
      role: result.role,
      username: result.username,
      full_name: result.full_name,
      bio: result.bio,
      start_year: result.start_year,
      major_id: result.major_id,
      university_id: result.university_id,
      avatar_url: result.avatar_url,
      interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm vào payload
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      message: "Cập nhật thông tin người dùng thành công",
      EC: 0,
      data: {
        ...result._doc,
        interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm vào data
      },
      access_token,
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email })
      .select("+password")
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const interestedCourses = await User_Interest_Course.find({
          user_id: user._id,
        })
          .populate("course_id", "course_name course_code")
          .select("course_id");
        const payload = {
          _id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          bio: user.bio,
          start_year: user.start_year,
          major_id: user.major_id,
          university_id: user.university_id,
          avatar_url: user.avatar_url,
          interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm vào payload
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          data: {
            _id: user._id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            start_year: user.start_year,
            major_id: user.major_id,
            university_id: user.university_id,
            avatar_url: user.avatar_url,
            interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm vào data
          },
        };
      } else {
        return {
          message: "Email hoặc mật khẩu không hợp lệ",
          EC: 1,
        };
      }
    } else {
      return {
        message: "Email hoặc mật khẩu không hợp lệ",
        EC: 1,
      };
    }
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateAvatarService = async (user_id, file) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        EC: 1,
      };
    }

    // Xóa ảnh đại diện cũ trên Cloudinary nếu không phải ảnh mặc định
    if (
      user.avatar_url &&
      user.avatar_url !==
        "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg"
    ) {
      const publicId = user.avatar_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`User/${publicId}`);
    }

    // Cập nhật ảnh đại diện mới
    const avatar_url = file.path; // URL từ Cloudinary
    const result = await User.findByIdAndUpdate(
      user_id,
      { avatar_url },
      { new: true }
    )
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");

    // Lấy danh sách khóa học yêu thích
    const interestedCourses = await User_Interest_Course.find({ user_id })
      .populate("course_id", "course_name course_code")
      .select("course_id");

    // Tạo token mới với thông tin cập nhật
    const payload = {
      _id: result._id,
      email: result.email,
      role: result.role,
      full_name: result.full_name,
      start_year: result.start_year,
      bio: result.bio,
      major_id: result.major_id,
      university_id: result.university_id,
      avatar_url: result.avatar_url,
      interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm vào payload
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      message: "Cập nhật ảnh đại diện thành công",
      EC: 0,
      data: {
        ...result._doc,
        interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm vào data
      },
      access_token,
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAccount = async (user) => {
  try {
    const interestedCourses = await User_Interest_Course.find({
      user_id: user._id,
    })
      .populate("course_id", "course_name course_code")
      .select("course_id");
    return {
      message: "Lấy thông tin tài khoản thành công",
      EC: 0,
      data: {
        ...user._doc,
        interested_courses: interestedCourses.map((ic) => ic.course_id), // Thêm danh sách khóa học yêu thích
      },
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  updateAvatarService,
  getAccount,
};
