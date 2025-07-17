const {
  createTagService,
  updateTagService,
  deleteTagService,
  getAllTagsService,
  getTagByIdService,
} = require("../services/tag.service");

const createTag = async (req, res) => {
  const { tag_name } = req.body;

  if (!tag_name) {
    return res.status(400).json({ message: "Thiếu tag_name", EC: 1 });
  }

  const result = await createTagService(tag_name);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateTag = async (req, res) => {
  const { id } = req.params;
  const { tag_name } = req.body;

  if (!tag_name) {
    return res.status(400).json({ message: "Thiếu tag_name", EC: 1 });
  }

  const result = await updateTagService(id, tag_name);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteTag = async (req, res) => {
  const { id } = req.params;

  const result = await deleteTagService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getAllTags = async (req, res) => {
  const result = await getAllTagsService(req.query);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getTagById = async (req, res) => {
  const { id } = req.params;

  const result = await getTagByIdService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createTag,
  updateTag,
  deleteTag,
  getAllTags,
  getTagById,
};
