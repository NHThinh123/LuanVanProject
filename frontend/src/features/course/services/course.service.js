import axios from "../../../services/axios.customize";

export const getAllCourses = async ({ keyword } = {}) => {
  try {
    const response = await axios.get("/courses", {
      params: { search: keyword },
    });
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

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axios.put(`/courses/${courseId}`, courseData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật khóa học");
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(`/courses/${courseId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa khóa học");
  }
};
