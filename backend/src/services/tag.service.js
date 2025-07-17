const Tag = require("../models/tag.model");
const Post_Tag = require("../models/post_tag.model");

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

    // Xóa tất cả liên kết trong Post_Tag liên quan đến tag này
    await Post_Tag.deleteMany({ tag_id: id });

    return {
      message: "Xóa thẻ thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteTagService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAllTagsService = async (query) => {
  try {
    const { keyword } = query || {};
    const filter = {};

    if (keyword) {
      filter.$text = { $search: keyword };
    }

    const tags = await Tag.find(
      filter,
      keyword ? { score: { $meta: "textScore" } } : {}
    ).sort(
      keyword
        ? { score: { $meta: "textScore" }, createdAt: -1 }
        : { createdAt: -1 }
    );

    // Đếm số lượng bài viết cho mỗi tag
    const tagsWithPostCount = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await Post_Tag.countDocuments({ tag_id: tag._id });
        return {
          ...tag._doc,
          post_count: postCount,
        };
      })
    );

    return {
      message: "Lấy danh sách thẻ thành công",
      EC: 0,
      data: tagsWithPostCount,
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

    // Đếm số lượng bài viết cho tag
    const postCount = await Post_Tag.countDocuments({ tag_id: id });

    return {
      message: "Lấy thông tin thẻ thành công",
      EC: 0,
      data: {
        ...tag._doc,
        post_count: postCount,
      },
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
