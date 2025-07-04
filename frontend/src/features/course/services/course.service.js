import axios from "../../../services/axios.customize";

export const getAllCourses = async () => {
  try {
    const response = await axios.get("/courses");
    return response.data.courses || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách khóa học");
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post("/courses", courseData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo khóa học");
  }
};
