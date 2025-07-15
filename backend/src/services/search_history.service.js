const SearchHistory = require("../models/search_history.model");
const User = require("../models/user.model");

const addSearchHistoryService = async (user_id, keyword) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    if (!keyword || keyword.trim().length === 0) {
      return { message: "Từ khóa tìm kiếm không hợp lệ", EC: 1 };
    }

    // Kiểm tra từ khóa đã tồn tại trong 10 mục mới nhất
    const recentSearch = await SearchHistory.findOne({
      user_id,
      keyword,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentSearch) {
      // Cập nhật thời gian của từ khóa trùng
      recentSearch.createdAt = new Date();
      await recentSearch.save();
      return {
        message: "Cập nhật lịch sử tìm kiếm thành công",
        EC: 0,
        data: recentSearch,
      };
    }

    const searchHistory = await SearchHistory.create({ user_id, keyword });
    return {
      message: "Thêm lịch sử tìm kiếm thành công",
      EC: 0,
      data: searchHistory,
    };
  } catch (error) {
    console.error("Error in addSearchHistoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getSearchHistoryService = async (user_id) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Lấy danh sách lịch sử tìm kiếm, giới hạn 10 mục mới nhất
    const searchHistory = await SearchHistory.find({ user_id })
      .select("keyword createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      message: "Lấy danh sách lịch sử tìm kiếm thành công",
      EC: 0,
      data: searchHistory,
    };
  } catch (error) {
    console.error("Error in getSearchHistoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteSearchHistoryService = async (user_id, search_id) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Xóa một mục lịch sử tìm kiếm
    const searchHistory = await SearchHistory.findOneAndDelete({
      _id: search_id,
      user_id,
    });
    if (!searchHistory) {
      return {
        message: "Lịch sử tìm kiếm không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    return {
      message: "Xóa lịch sử tìm kiếm thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteSearchHistoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const clearAllSearchHistoryService = async (user_id) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Xóa tất cả lịch sử tìm kiếm của người dùng
    await SearchHistory.deleteMany({ user_id });

    return {
      message: "Xóa tất cả lịch sử tìm kiếm thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in clearAllSearchHistoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  addSearchHistoryService,
  getSearchHistoryService,
  deleteSearchHistoryService,
  clearAllSearchHistoryService,
};
