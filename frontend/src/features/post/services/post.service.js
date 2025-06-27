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
