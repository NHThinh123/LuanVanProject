const User_Interest_Course = require("../models/user_interest_course.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");

const addInterestCourseService = async (user_id, course_id) => {
  try {
    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(course_id);
    if (!course) {
      return { message: "Khóa học không tồn tại", EC: 1 };
    }

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra xem người dùng đã quan tâm khóa học chưa
    const existingInterest = await User_Interest_Course.findOne({
      user_id,
      course_id,
    });
    if (existingInterest) {
      return { message: "Bạn đã quan tâm khóa học này", EC: 1 };
    }

    // Thêm khóa học quan tâm
    const interest = await User_Interest_Course.create({ user_id, course_id });
    return {
      message: "Thêm khóa học quan tâm thành công",
      EC: 0,
      data: interest,
    };
  } catch (error) {
    console.error("Error in addInterestCourseService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const removeInterestCourseService = async (user_id, course_id) => {
  try {
    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(course_id);
    if (!course) {
      return { message: "Khóa học không tồn tại", EC: 1 };
    }

    // Kiểm tra lượt quan tâm có tồn tại không
    const interest = await User_Interest_Course.findOneAndDelete({
      user_id,
      course_id,
    });
    if (!interest) {
      return { message: "Bạn chưa quan tâm khóa học này", EC: 1 };
    }

    return {
      message: "Xóa khóa học quan tâm thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in removeInterestCourseService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getInterestedCoursesByUserService = async (user_id) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Lấy danh sách khóa học quan tâm
    const interests = await User_Interest_Course.find({ user_id })
      .populate("course_id", "course_name course_code")
      .select("course_id createdAt");

    return {
      message: "Lấy danh sách khóa học quan tâm thành công",
      EC: 0,
      data: interests,
    };
  } catch (error) {
    console.error("Error in getInterestedCoursesByUserService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const checkUserInterestedCourseService = async (user_id, course_id) => {
  try {
    const interest = await User_Interest_Course.findOne({ user_id, course_id });
    return {
      message: "Kiểm tra trạng thái quan tâm thành công",
      EC: 0,
      data: { interested: !!interest },
    };
  } catch (error) {
    console.error("Error in checkUserInterestedCourseService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  addInterestCourseService,
  removeInterestCourseService,
  getInterestedCoursesByUserService,
  checkUserInterestedCourseService,
};
