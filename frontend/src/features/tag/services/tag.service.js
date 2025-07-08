import axios from "../../../services/axios.customize";

export const getAllTags = async () => {
  try {
    const response = await axios.get("/tags");
    return response.data || []; // Điều chỉnh để lấy đúng data từ response
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách thẻ");
  }
};

export const createTag = async (tag_name) => {
  try {
    const response = await axios.post("/tags", { tag_name });
    return response; // Trả về response đầy đủ để xử lý EC
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo thẻ");
  }
};

export const addTagsToPost = async ({ post_id, tag_ids }) => {
  try {
    const promises = tag_ids.map((tag_id) =>
      axios.post("/post-tags", { post_id, tag_id })
    );
    const responses = await Promise.all(promises);
    return responses.map((res) => res); // Trả về response đầy đủ
  } catch (error) {
    throw new Error(error.message || "Lỗi khi gắn thẻ vào bài viết");
  }
};
