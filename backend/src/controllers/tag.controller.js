const {
  createTagService,
  getTagsService,
  getTagByIdService,
  updateTagService,
  deleteTagService,
} = require("../services/tag.service");

const createTag = async (req, res) => {
  const { tag_name } = req.body;
  if (!tag_name) {
    return res.status(400).json({
      message: "Vui lòng cung cấp tên thẻ",
    });
  }

  try {
    const data = await createTagService({ tag_name });
    return res.status(201).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getTags = async (req, res) => {
  try {
    const data = await getTagsService();
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const data = await getTagByIdService(req.params.id);
    if (!data.data) {
      return res.status(404).json({ message: "Thẻ không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const updateTag = async (req, res) => {
  const { tag_name } = req.body;
  if (!tag_name) {
    return res.status(400).json({ message: "Tên thẻ không được để trống" });
  }
  try {
    const data = await updateTagService(req.params.id, { tag_name });
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Thẻ không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const data = await deleteTagService(req.params.id);
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Thẻ không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
};
