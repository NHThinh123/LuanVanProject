import axios from "../../../services/axios.customize";

export const createComment = async ({
  post_id,
  content,
  parent_comment_id,
}) => {
  try {
    const response = await axios.post("/comments", {
      post_id,
      content,
      parent_comment_id: parent_comment_id || null,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo bình luận");
  }
};

export const getCommentsByPost = async (post_id, queryParams = {}) => {
  try {
    const response = await axios.get(`/comments/post/${post_id}`, {
      params: {
        ...queryParams,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách bình luận");
  }
};

export const getRepliesByComment = async (comment_id, queryParams = {}) => {
  try {
    const response = await axios.get(`/comments/replies/${comment_id}`, {
      params: {
        ...queryParams,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách phản hồi");
  }
};

export const getCommentById = async (comment_id) => {
  try {
    const response = await axios.get(`/comments/${comment_id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy thông tin bình luận");
  }
};

export const deleteComment = async (comment_id) => {
  try {
    const response = await axios.delete(`/comments/${comment_id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa bình luận");
  }
};

export const likeComment = async (comment_id) => {
  try {
    console.log("Like comment with ID:", comment_id);
    const response = await axios.post("/like-comments/like", { comment_id });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi thích bình luận");
  }
};

export const unlikeComment = async (comment_id) => {
  try {
    const response = await axios.delete("/like-comments/unlike", {
      data: { comment_id },
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi bỏ thích bình luận");
  }
};
