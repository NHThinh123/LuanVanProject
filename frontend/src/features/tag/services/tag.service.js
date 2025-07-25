import axios from "../../../services/axios.customize";

export const getAllTags = async (query = {}) => {
  try {
    const response = await axios.get("/tags", { params: query });
    return response.data || [];
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách thẻ");
  }
};

export const createTag = async (tag_name) => {
  try {
    const response = await axios.post("/tags", { tag_name });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo thẻ");
  }
};

export const updateTag = async (tagId, tagData) => {
  try {
    const response = await axios.put(`/tags/${tagId}`, tagData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật thẻ");
  }
};

export const deleteTag = async (tagId) => {
  try {
    const response = await axios.delete(`/tags/${tagId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa thẻ");
  }
};

export const addTagsToPost = async ({ post_id, tag_ids }) => {
  try {
    const promises = tag_ids.map((tag_id) =>
      axios.post("/post-tags", { post_id, tag_id })
    );
    const responses = await Promise.all(promises);
    return responses.map((res) => res);
  } catch (error) {
    throw new Error(error.message || "Lỗi khi gắn thẻ vào bài viết");
  }
};
