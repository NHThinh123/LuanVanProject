const {
  createPostService,
  updatePostService,
  deletePostService,
  getPostsService,
  getPostByIdService,
  updatePostStatusService,
  getRecommendedPostsService,
  searchPostsService,
} = require("../services/post.service");
const {
  addSearchHistoryService,
} = require("../services/search_history.service");

const createPost = async (req, res) => {
  const { course_id, category_id, title, content } = req.body;
  const user_id = req.user._id;

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
  const current_user_id = req.user?._id;

  const result = await getPostsService({
    user_id,
    course_id,
    category_id,
    status,
    page,
    limit,
    current_user_id,
  });
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;
  const current_user_id = req.user?._id;

  const result = await getPostByIdService(post_id, current_user_id);
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

const getRecommendedPosts = async (req, res) => {
  const { page, limit } = req.query;
  const user_id = req.user._id;

  const result = await getRecommendedPostsService({
    user_id,
    page,
    limit,
    current_user_id: user_id,
  });
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const searchPosts = async (req, res) => {
  const { keyword, page = 1, limit = 10 } = req.query;
  const user_id = req.user._id;

  if (!keyword) {
    return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm", EC: 1 });
  }

  // Lưu từ khóa vào lịch sử tìm kiếm
  const searchHistoryResult = await addSearchHistoryService(user_id, keyword);
  if (searchHistoryResult.EC !== 0) {
    console.error("Lỗi khi lưu lịch sử tìm kiếm:", searchHistoryResult.message);
    // Tiếp tục xử lý tìm kiếm ngay cả khi lưu lịch sử thất bại
  }

  // Tìm kiếm bài viết
  const result = await searchPostsService({
    keyword,
    page,
    limit,
    current_user_id: user_id,
  });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  updatePostStatus,
  getRecommendedPosts,
  searchPosts,
};
