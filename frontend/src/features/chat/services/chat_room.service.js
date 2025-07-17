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

export const createChatRoom = async ({ member_id }) => {
  try {
    const response = await axios.post("/chat-rooms", { member_id });
    return (
      response.data || { message: "Tạo phòng chat thành công", EC: 0, data: {} }
    );
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo phòng chat");
  }
};
