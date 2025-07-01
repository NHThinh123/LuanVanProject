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
        ...queryParams, // Truyền các tham số truy vấn từ queryParams
      },
    });

    return response.data.posts; // Trả về danh sách bài viết
  } catch (error) {
    throw new Error(error.message || "Lỗi server");
  }
};
export const getPostById = async (post_id) => {
  try {
    const response = await axios.get(`/posts/${post_id}`);
    return response.data; // Trả về bài viết chi tiết
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy thông tin bài viết");
  }
};
