import axios from "../../../services/axios.customize";

export const getAllCategories = async () => {
  try {
    const response = await axios.get("/categories");
    return response.data.categories || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách danh mục");
  }
};
