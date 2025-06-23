const {
  addSearchHistoryService,
  getSearchHistoryService,
  deleteSearchHistoryService,
  clearAllSearchHistoryService,
} = require("../services/search_history.service");

const addSearchHistory = async (req, res) => {
  const { keyword } = req.body;
  const user_id = req.user.id; // Lấy từ middleware authentication

  if (!keyword) {
    return res.status(400).json({ message: "Thiếu keyword", EC: 1 });
  }

  const result = await addSearchHistoryService(user_id, keyword);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getSearchHistory = async (req, res) => {
  const user_id = req.user.id;

  const result = await getSearchHistoryService(user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const deleteSearchHistory = async (req, res) => {
  const { search_id } = req.params;
  const user_id = req.user.id;

  const result = await deleteSearchHistoryService(user_id, search_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const clearAllSearchHistory = async (req, res) => {
  const user_id = req.user.id;

  const result = await clearAllSearchHistoryService(user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  addSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  clearAllSearchHistory,
};
