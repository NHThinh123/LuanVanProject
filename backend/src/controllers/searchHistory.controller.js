const {
  createSearchHistoryService,
  getSearchHistoryByUserService,
  deleteSearchHistoryService,
} = require("../services/searchHistory.service");

const createSearchHistory = async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).json({
      message: "Vui lòng cung cấp từ khóa tìm kiếm",
    });
  }

  try {
    const data = await createSearchHistoryService({
      user_id: req.user.id, // Lấy từ middleware xác thực
      keyword,
    });
    return res.status(201).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getSearchHistoryByUser = async (req, res) => {
  try {
    const data = await getSearchHistoryByUserService(req.user.id);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const deleteSearchHistory = async (req, res) => {
  try {
    const data = await deleteSearchHistoryService(req.params.id, req.user);
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Lịch sử tìm kiếm không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  createSearchHistory,
  getSearchHistoryByUser,
  deleteSearchHistory,
};
