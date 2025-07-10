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
      parent_comment_id: parent_comment_id || null, // Đảm bảo parent_comment_id là null cho bình luận gốc
    });
    return response; // { message, EC, data }
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
    return response.data; // { message, EC, data: { comments, pagination } }
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
    return response.data; // { message, EC, data: { comments, pagination } }
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách phản hồi");
  }
};

export const getCommentById = async (comment_id) => {
  try {
    const response = await axios.get(`/comments/${comment_id}`);
    return response; // { message, EC, data }
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy thông tin bình luận");
  }
};

export const deleteComment = async (comment_id) => {
  try {
    const response = await axios.delete(`/comments/${comment_id}`);
    return response; // { message, EC }
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa bình luận");
  }
};
