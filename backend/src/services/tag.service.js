const Tag = require("../models/tag.model");
const PostTag = require("../models/post_tag.model");

const createTagService = async (tagData) => {
  try {
    // Kiểm tra xem tag_name đã tồn tại
    const existingTag = await Tag.findOne({ tag_name: tagData.tag_name });
    if (existingTag) {
      return {
        message: "Thẻ đã tồn tại",
        data: null,
      };
    }
    const tag = await Tag.create(tagData);
    return {
      message: "Tạo thẻ thành công",
      data: tag,
    };
  } catch (error) {
    throw new Error("Không thể tạo thẻ: " + error.message);
  }
};

const getTagsService = async () => {
  try {
    const tags = await Tag.find({});
    return {
      message: "Lấy danh sách thẻ thành công",
      data: tags,
    };
  } catch (error) {
    throw new Error("Không thể lấy danh sách thẻ: " + error.message);
  }
};

const getTagByIdService = async (id) => {
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return {
        message: "Thẻ không tồn tại",
        data: null,
      };
    }
    return {
      message: "Lấy thẻ thành công",
      data: tag,
    };
  } catch (error) {
    throw new Error("Không thể lấy thẻ: " + error.message);
  }
};

const updateTagService = async (id, updateData) => {
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return {
        message: "Thẻ không tồn tại",
        data: null,
      };
    }
    // Kiểm tra xem tag_name mới đã tồn tại
    if (updateData.tag_name && updateData.tag_name !== tag.tag_name) {
      const existingTag = await Tag.findOne({ tag_name: updateData.tag_name });
      if (existingTag) {
        return {
          message: "Tên thẻ mới đã tồn tại",
          data: null,
        };
      }
    }
    const updatedTag = await Tag.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return {
      message: "Cập nhật thẻ thành công",
      data: updatedTag,
    };
  } catch (error) {
    throw new Error("Không thể cập nhật thẻ: " + error.message);
  }
};

const deleteTagService = async (id) => {
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return {
        message: "Thẻ không tồn tại",
        data: null,
      };
    }
    // Kiểm tra xem thẻ có được sử dụng trong bài đăng
    const relatedPostTags = await PostTag.find({ tag_id: id });
    if (relatedPostTags.length > 0) {
      return {
        message: "Không thể xóa thẻ vì có bài đăng liên quan",
        data: null,
      };
    }
    await Tag.findByIdAndDelete(id);
    return {
      message: "Xóa thẻ thành công",
      data: { id },
    };
  } catch (error) {
    throw new Error("Không thể xóa thẻ: " + error.message);
  }
};

module.exports = {
  createTagService,
  getTagsService,
  getTagByIdService,
  updateTagService,
  deleteTagService,
};
