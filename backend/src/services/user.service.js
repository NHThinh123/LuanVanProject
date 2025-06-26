require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

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
      access_token, // Trả về token
    };
  } catch (error) {
    console.error(error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getUsersService = async () => {
  try {
    let result = await User.find({})
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserByIdService = async (id) => {
  try {
    let result = await User.findById(id)
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!result) {
      return {
        message: "Người dùng không tồn tại",
      };
    }
    return {
      message: "Lấy thông tin người dùng thành công",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateUserService = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    let result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!result) {
      return {
        message: "Người dùng không tồn tại",
      };
    }

    // Tạo token mới với thông tin cập nhật
    const payload = {
      _id: result._id,
      email: result.email,
      role: result.role,
      username: result.username,
      full_name: result.full_name,
      start_year: result.start_year,
      major_id: result.major_id,
      university_id: result.university_id,
      avatar_url: result.avatar_url,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      message: "Cập nhật thông tin người dùng thành công",
      data: result,
      access_token,
    };
  } catch (error) {
    console.error(error);
    return null;
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
        const payload = {
          _id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          start_year: user.start_year,
          major_id: user.major_id,
          university_id: user.university_id,
          avatar_url: user.avatar_url,
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

    // Tạo token mới với thông tin cập nhật
    const payload = {
      _id: result._id,
      email: result.email,
      role: result.role,
      full_name: result.full_name,
      start_year: result.start_year,
      major_id: result.major_id,
      university_id: result.university_id,
      avatar_url: result.avatar_url,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      message: "Cập nhật ảnh đại diện thành công",
      EC: 0,
      data: result,
      access_token,
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
};
