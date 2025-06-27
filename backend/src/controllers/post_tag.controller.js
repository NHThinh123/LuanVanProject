const {
  addTagToPostService,
  removeTagFromPostService,
  getTagsByPostService,
  getPostsByTagService,
} = require("../services/post_tag.service");

const addTagToPost = async (req, res) => {
  const { post_id, tag_id } = req.body;
  const user_id = req.user._id; // Lấy từ middleware authentication

  if (!post_id || !tag_id) {
    return res
      .status(400)
      .json({ message: "Thiếu post_id hoặc tag_id", EC: 1 });
  }

  const result = await addTagToPostService(post_id, tag_id, user_id);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const removeTagFromPost = async (req, res) => {
  const { post_id, tag_id } = req.body;
  const user_id = req.user._id;

  if (!post_id || !tag_id) {
    return res
      .status(400)
      .json({ message: "Thiếu post_id hoặc tag_id", EC: 1 });
  }

  const result = await removeTagFromPostService(post_id, tag_id, user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getTagsByPost = async (req, res) => {
  const { post_id } = req.params;

  const result = await getTagsByPostService(post_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getPostsByTag = async (req, res) => {
  const { tag_id } = req.params;
  const { page, limit } = req.query;

  const result = await getPostsByTagService(tag_id, { page, limit });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  addTagToPost,
  removeTagFromPost,
  getTagsByPost,
  getPostsByTag,
};
