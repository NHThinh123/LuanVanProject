const {
  createPostService,
  updatePostService,
  deletePostService,
  getPostsService,
  getPostByIdService,
  updatePostStatusService,
  getRecommendedPostsService,
  searchPostsService,
  getPostsByTagService,
  getFollowingPostsService,
} = require("../services/post.service");
const {
  addSearchHistoryService,
} = require("../services/search_history.service");

const createPost = async (req, res) => {
  const { course_id, category_id, title, content, imageUrls } = req.body;
  const user_id = req.user._id;

  if (!title || !content) {
    return res.status(400).json({ message: "Thiếu title hoặc content", EC: 1 });
  }

  const result = await createPostService(user_id, {
    course_id,
    category_id,
    title,
    content,
    imageUrls,
  });
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { course_id, category_id, title, content, imageUrls } = req.body;
  const user_id = req.user._id;

  // Không yêu cầu title hoặc content bắt buộc, cho phép chỉ gửi imageUrls
  const postData = {};
  if (course_id) postData.course_id = course_id;
  if (category_id) postData.category_id = category_id;
  if (title) postData.title = title;
  if (content) postData.content = content;
  if (imageUrls) postData.imageUrls = imageUrls;

  const result = await updatePostService(user_id, post_id, postData);
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

  const searchHistoryResult = await addSearchHistoryService(user_id, keyword);
  if (searchHistoryResult.EC !== 0) {
    console.error("Lỗi khi lưu lịch sử tìm kiếm:", searchHistoryResult.message);
  }

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

const getPostsByTag = async (req, res) => {
  const { tag_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const current_user_id = req.user?._id;

  const result = await getPostsByTagService({
    tag_id,
    page,
    limit,
    current_user_id,
  });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getFollowingPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const current_user_id = req.user._id;

  const result = await getFollowingPostsService({
    current_user_id,
    page,
    limit,
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
  getPostsByTag,
  getFollowingPosts,
};
