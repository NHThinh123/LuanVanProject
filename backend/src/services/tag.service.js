const Tag = require("../models/tag.model");

const createTagService = async (tag_name) => {
  try {
    // Kiểm tra xem thẻ đã tồn tại chưa
    const existingTag = await Tag.findOne({ tag_name });
    if (existingTag) {
      return { message: "Thẻ đã tồn tại", EC: 1 };
    }

    // Tạo thẻ mới
    const tag = await Tag.create({ tag_name });
    return {
      message: "Tạo thẻ thành công",
      EC: 0,
      data: tag,
    };
  } catch (error) {
    console.error("Error in createTagService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateTagService = async (id, tag_name) => {
  try {
    // Kiểm tra thẻ có tồn tại không
    const tag = await Tag.findById(id);
    if (!tag) {
      return { message: "Thẻ không tồn tại", EC: 1 };
    }

    // Kiểm tra xem tên mới có trùng với thẻ khác không
    const existingTag = await Tag.findOne({
      tag_name,
      _id: { $ne: id },
    });
    if (existingTag) {
      return { message: "Tên thẻ đã tồn tại", EC: 1 };
    }

    // Cập nhật thẻ
    tag.tag_name = tag_name;
    await tag.save();

    return {
      message: "Cập nhật thẻ thành công",
      EC: 0,
      data: tag,
    };
  } catch (error) {
    console.error("Error in updateTagService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteTagService = async (id) => {
  try {
    // Kiểm tra thẻ có tồn tại không
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return { message: "Thẻ không tồn tại", EC: 1 };
    }

    return {
      message: "Xóa thẻ thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteTagService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAllTagsService = async () => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    return {
      message: "Lấy danh sách thẻ thành công",
      EC: 0,
      data: tags,
    };
  } catch (error) {
    console.error("Error in getAllTagsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getTagByIdService = async (id) => {
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return { message: "Thẻ không tồn tại", EC: 1 };
    }

    return {
      message: "Lấy thông tin thẻ thành công",
      EC: 0,
      data: tag,
    };
  } catch (error) {
    console.error("Error in getTagByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createTagService,
  updateTagService,
  deleteTagService,
  getAllTagsService,
  getTagByIdService,
};
