import axios from "../../../services/axios.customize";

export const getSearchHistory = async () => {
  try {
    const response = await axios.get("/search-history");
    return response.data || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách lịch sử tìm kiếm");
  }
};

export const addSearchHistory = async (keyword) => {
  try {
    const response = await axios.post("/search-history", { keyword });
    return response.data || {};
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lưu từ khóa tìm kiếm");
  }
};
