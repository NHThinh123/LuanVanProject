import axios from "../../../services/axios.customize";

export const getUsers = async (queryParams = {}) => {
  try {
    const response = await axios.get("/users", {
      params: {
        ...queryParams, // Truyền các tham số truy vấn từ queryParams
      },
    });

    return response.data; // Trả về danh sách bài viết
  } catch (error) {
    throw new Error(error.message || "Lỗi server");
  }
};
