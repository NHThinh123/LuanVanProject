import axios from "../../../services/axios.customize";

export const getAllCategories = async () => {
  try {
    const response = await axios.get("/categories");
    return response.data.categories || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách danh mục");
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`/categories/${categoryId}`, categoryData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật danh mục");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`/categories/${categoryId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa danh mục");
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post("/categories", categoryData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo danh mục");
  }
};
