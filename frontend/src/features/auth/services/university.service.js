import axios from "../../../services/axios.customize";

export const getAllUniversities = async () => {
  try {
    const response = await axios.get("/universities");
    return response.data; // Trả về danh sách trường đại học
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách trường đại học");
  }
};

export const createUniversity = async (university_name) => {
  try {
    const response = await axios.post("/universities", { university_name });
    return response; // Trả về trường đại học mới
  } catch (error) {
    throw new Error(error.message || "Lỗi khi thêm trường đại học");
  }
};
