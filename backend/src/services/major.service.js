const Major = require("../models/major.model");

const createMajorService = async (major_name) => {
  try {
    // Kiểm tra xem ngành học đã tồn tại chưa
    const existingMajor = await Major.findOne({ major_name });
    if (existingMajor) {
      return { message: "Ngành học đã tồn tại", EC: 1 };
    }

    // Tạo ngành học mới
    const major = await Major.create({ major_name });
    return {
      message: "Tạo ngành học thành công",
      EC: 0,
      data: major,
    };
  } catch (error) {
    console.error("Error in createMajorService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateMajorService = async (id, major_name) => {
  try {
    // Kiểm tra ngành học có tồn tại không
    const major = await Major.findById(id);
    if (!major) {
      return { message: "Ngành học không tồn tại", EC: 1 };
    }

    // Kiểm tra xem tên mới có trùng với ngành khác không
    const existingMajor = await Major.findOne({
      major_name,
      _id: { $ne: id },
    });
    if (existingMajor) {
      return { message: "Tên ngành học đã tồn tại", EC: 1 };
    }

    // Cập nhật ngành học
    major.major_name = major_name;
    await major.save();

    return {
      message: "Cập nhật ngành học thành công",
      EC: 0,
      data: major,
    };
  } catch (error) {
    console.error("Error in updateMajorService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteMajorService = async (id) => {
  try {
    // Kiểm tra ngành học có tồn tại không
    const major = await Major.findByIdAndDelete(id);
    if (!major) {
      return { message: "Ngành học không tồn tại", EC: 1 };
    }

    return {
      message: "Xóa ngành học thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteMajorService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAllMajorsService = async () => {
  try {
    const majors = await Major.find().sort({ createdAt: -1 });
    return {
      message: "Lấy danh sách ngành học thành công",
      EC: 0,
      data: majors,
    };
  } catch (error) {
    console.error("Error in getAllMajorsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getMajorByIdService = async (id) => {
  try {
    const major = await Major.findById(id);
    if (!major) {
      return { message: "Ngành học không tồn tại", EC: 1 };
    }

    return {
      message: "Lấy thông tin ngành học thành công",
      EC: 0,
      data: major,
    };
  } catch (error) {
    console.error("Error in getMajorByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createMajorService,
  updateMajorService,
  deleteMajorService,
  getAllMajorsService,
  getMajorByIdService,
};
