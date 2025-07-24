import axios from "../../../services/axios.customize";

export const getStatistics = async ({ range }) => {
  try {
    const response = await axios.get("/statistics", {
      params: {
        range,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy dữ liệu thống kê");
  }
};
