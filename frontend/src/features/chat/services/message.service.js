import axios from "../../../services/axios.customize";

export const getMessagesByChatRoom = async (
  chat_room_id,
  page = 1,
  limit = 20
) => {
  try {
    const response = await axios.get(`/messages/room/${chat_room_id}`, {
      params: { page, limit },
    });
    return (
      response.data || {
        messages: [],
        pagination: { page, limit, total: 0, totalPages: 1 },
      }
    );
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách tin nhắn");
  }
};

export const sendMessage = async (chat_room_id, content) => {
  try {
    const response = await axios.post("/messages", {
      chat_room_id,
      content,
    });
    return (
      response.data || { message: "Gửi tin nhắn thành công", EC: 0, data: {} }
    );
  } catch (error) {
    throw new Error(error.message || "Lỗi khi gửi tin nhắn");
  }
};

export const deleteMessage = async (message_id) => {
  try {
    const response = await axios.delete(`/messages/${message_id}`);
    return response.data || { message: "Xóa tin nhắn thành công", EC: 0 };
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa tin nhắn");
  }
};

export const markMessageAsRead = async (chat_room_id) => {
  try {
    const response = await axios.post(`/messages/read/${chat_room_id}`);
    return response.data || { message: "Đánh dấu đã đọc thành công", EC: 0 };
  } catch (error) {
    throw new Error(error.message || "Lỗi khi đánh dấu đã đọc");
  }
};
