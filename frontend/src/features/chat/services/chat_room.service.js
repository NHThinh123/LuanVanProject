import axios from "../../../services/axios.customize";

export const getUserChatRooms = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get("/chat-rooms", {
      params: { page, limit },
    });
    return (
      response.data || {
        chatRooms: [],
        pagination: { page, limit, total: 0, totalPages: 1 },
      }
    );
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách phòng chat");
  }
};
