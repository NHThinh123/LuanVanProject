const Course = require("../models/course.model");

const createCourseService = async (courseData) => {
  try {
    const { course_name, course_code } = courseData;

    // Kiểm tra tên khóa học đã tồn tại chưa
    const existingCourse = await Course.findOne({ course_name });
    if (existingCourse) {
      return { message: "Tên khóa học đã tồn tại", EC: 1 };
    }

    // Kiểm tra mã khóa học nếu có
    if (course_code) {
      const existingCode = await Course.findOne({ course_code });
      if (existingCode) {
        return { message: "Mã khóa học đã tồn tại", EC: 1 };
      }
    }

    // Tạo khóa học mới
    const course = await Course.create({ course_name, course_code });
    return {
      message: "Tạo khóa học thành công",
      EC: 0,
      data: course,
    };
  } catch (error) {
    console.error("Error in createCourseService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateCourseService = async (id, courseData) => {
  try {
    const { course_name, course_code } = courseData;

    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(id);
    if (!course) {
      return { message: "Khóa học không tồn tại", EC: 1 };
    }

    // Kiểm tra tên khóa học mới có trùng không
    if (course_name) {
      const existingCourse = await Course.findOne({
        course_name,
        _id: { $ne: id },
      });
      if (existingCourse) {
        return { message: "Tên khóa học đã tồn tại", EC: 1 };
      }
    }

    // Kiểm tra mã khóa học mới nếu có
    if (course_code) {
      const existingCode = await Course.findOne({
        course_code,
        _id: { $ne: id },
      });
      if (existingCode) {
        return { message: "Mã khóa học đã tồn tại", EC: 1 };
      }
    }

    // Cập nhật khóa học
    course.course_name = course_name || course.course_name;
    course.course_code = course_code || course.course_code;
    await course.save();

    return {
      message: "Cập nhật khóa học thành công",
      EC: 0,
      data: course,
    };
  } catch (error) {
    console.error("Error in updateCourseService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteCourseService = async (id) => {
  try {
    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return { message: "Khóa học không tồn tại", EC: 1 };
    }

    return {
      message: "Xóa khóa học thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteCourseService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAllCoursesService = async (query) => {
  try {
    const { page = 1, limit = 10, search } = query;
    const filter = {};

    // Tìm kiếm theo tên hoặc mã khóa học nếu có
    if (search) {
      filter.$or = [
        { course_name: { $regex: search, $options: "i" } },
        { course_code: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Lấy danh sách khóa học
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    return {
      message: "Lấy danh sách khóa học thành công",
      EC: 0,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllCoursesService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getCourseByIdService = async (id) => {
  try {
    const course = await Course.findById(id);
    if (!course) {
      return { message: "Khóa học không tồn tại", EC: 1 };
    }

    return {
      message: "Lấy thông tin khóa học thành công",
      EC: 0,
      data: course,
    };
  } catch (error) {
    console.error("Error in getCourseByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getAllCoursesService,
  getCourseByIdService,
};
