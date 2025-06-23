const University = require("../models/university.model");

const createUniversityService = async (university_name) => {
  try {
    // Kiểm tra xem trường đã tồn tại chưa
    const existingUniversity = await University.findOne({ university_name });
    if (existingUniversity) {
      return { message: "Trường đại học đã tồn tại", EC: 1 };
    }

    // Tạo trường đại học mới
    const university = await University.create({ university_name });
    return {
      message: "Tạo trường đại học thành công",
      EC: 0,
      data: university,
    };
  } catch (error) {
    console.error("Error in createUniversityService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateUniversityService = async (id, university_name) => {
  try {
    // Kiểm tra trường đại học có tồn tại không
    const university = await University.findById(id);
    if (!university) {
      return { message: "Trường đại học không tồn tại", EC: 1 };
    }

    // Kiểm tra xem tên mới có trùng với trường khác không
    const existingUniversity = await University.findOne({
      university_name,
      _id: { $ne: id },
    });
    if (existingUniversity) {
      return { message: "Tên trường đại học đã tồn tại", EC: 1 };
    }

    // Cập nhật trường đại học
    university.university_name = university_name;
    await university.save();

    return {
      message: "Cập nhật trường đại học thành công",
      EC: 0,
      data: university,
    };
  } catch (error) {
    console.error("Error in updateUniversityService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteUniversityService = async (id) => {
  try {
    // Kiểm tra trường đại học có tồn tại không
    const university = await University.findByIdAndDelete(id);
    if (!university) {
      return { message: "Trường đại học không tồn tại", EC: 1 };
    }

    return {
      message: "Xóa trường đại học thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteUniversityService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAllUniversitiesService = async () => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    return {
      message: "Lấy danh sách trường đại học thành công",
      EC: 0,
      data: universities,
    };
  } catch (error) {
    console.error("Error in getAllUniversitiesService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getUniversityByIdService = async (id) => {
  try {
    const university = await University.findById(id);
    if (!university) {
      return { message: "Trường đại học không tồn tại", EC: 1 };
    }

    return {
      message: "Lấy thông tin trường đại học thành công",
      EC: 0,
      data: university,
    };
  } catch (error) {
    console.error("Error in getUniversityByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createUniversityService,
  updateUniversityService,
  deleteUniversityService,
  getAllUniversitiesService,
  getUniversityByIdService,
};
