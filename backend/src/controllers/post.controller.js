const {
  createPostService,
  updatePostService,
  deletePostService,
  getPostsService,
  getPostByIdService,
  updatePostStatusService,
} = require("../services/post.service");

const createPost = async (req, res) => {
  const { course_id, category_id, title, content } = req.body;
  const user_id = req.user._id; // Lấy từ middleware authentication

  if (!title || !content) {
    return res.status(400).json({ message: "Thiếu title hoặc content", EC: 1 });
  }

  const result = await createPostService(user_id, {
    course_id,
    category_id,
    title,
    content,
  });
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { course_id, category_id, title, content } = req.body;
  const user_id = req.user._id;

  const result = await updatePostService(user_id, post_id, {
    course_id,
    category_id,
    title,
    content,
  });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const user_id = req.user._id;

  const result = await deletePostService(user_id, post_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getPosts = async (req, res) => {
  const { user_id, course_id, category_id, status, page, limit } = req.query;

  const result = await getPostsService({
    user_id,
    course_id,
    category_id,
    status,
    page,
    limit,
  });
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  const result = await getPostByIdService(post_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const updatePostStatus = async (req, res) => {
  const { post_id } = req.params;
  const { status } = req.body;
  const admin_id = req.user._id;

  if (!status) {
    return res.status(400).json({ message: "Thiếu status", EC: 1 });
  }

  const result = await updatePostStatusService(post_id, status, admin_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 403 : 500)
    .json(result);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  updatePostStatus,
};
