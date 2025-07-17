import axios from "../../../services/axios.customize";

export const createPost = async ({
  course_id,
  category_id,
  title,
  content,
}) => {
  try {
    const response = await axios.post("/posts/", {
      course_id,
      category_id,
      title,
      content,
    });

    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo bài viết");
  }
};

export const getPosts = async (queryParams = {}) => {
  try {
    const response = await axios.get("/posts", {
      params: {
        ...queryParams,
      },
    });

    return response.data; // Trả về danh sách bài viết
  } catch (error) {
    throw new Error(error.message || "Lỗi server");
  }
};

export const searchPosts = async (queryParams = {}) => {
  try {
    const response = await axios.get("/posts/search", {
      params: {
        ...queryParams,
      },
    });

    return response.data; // Trả về danh sách bài viết tìm kiếm
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tìm kiếm bài viết");
  }
};

export const getPostById = async (post_id, user_id) => {
  try {
    const response = await axios.get(`/posts/${post_id}`, {
      params: {
        current_user_id: user_id, // Truyền ID người dùng hiện tại để kiểm tra trạng thái thích bài viết
      },
    });
    return response.data; // Trả về bài viết chi tiết
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy thông tin bài viết");
  }
};

export const likePost = async (postId, current_user_id) => {
  try {
    const response = await axios.post("/like-posts/like", {
      post_id: postId,
      current_user_id,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi thích bài viết");
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await axios.delete("/like-posts/unlike", {
      data: { post_id: postId },
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi bỏ thích bài viết");
  }
};

export const getRecommendedPosts = async (queryParams = {}) => {
  try {
    const response = await axios.get("/posts/recommend", {
      params: {
        ...queryParams,
      },
    });
    return response.data; // Trả về danh sách bài viết đề xuất
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách bài viết đề xuất");
  }
};

export const getPostsByTag = async ({ tag_id, page = 1, limit = 10 }) => {
  try {
    const response = await axios.get(`/posts/tag/${tag_id}`, {
      params: { page, limit },
    });
    return response.data || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách bài viết theo thẻ");
  }
};
