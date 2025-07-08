import axios from "../../../services/axios.customize";

export const getAllTags = async () => {
  try {
    const response = await axios.get("/tags");
    return response.data || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách thẻ");
  }
};

export const createTag = async (tag_name) => {
  try {
    const response = await axios.post("/tags", { tag_name });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo thẻ");
  }
};

export const addTagToPost = async (post_id, tag_id) => {
  try {
    const response = await axios.post("/post-tags", { post_id, tag_id });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi gắn thẻ vào bài viết");
  }
};
