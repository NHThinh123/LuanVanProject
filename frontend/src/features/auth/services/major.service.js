// services/major.service.js
import axios from "../../../services/axios.customize";

export const getAllMajors = async () => {
  try {
    const response = await axios.get("/majors");
    return response.data; // Trả về danh sách ngành học
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách ngành học");
  }
};

export const createMajor = async (major_name) => {
  try {
    const response = await axios.post("/majors", { major_name });
    return response; // Trả về ngành học mới
  } catch (error) {
    throw new Error(error.message || "Lỗi khi thêm ngành học");
  }
};
