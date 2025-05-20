const SearchHistory = require("../models/search_history.model");
const User = require("../models/user.model");

const createSearchHistoryService = async (searchData) => {
  try {
    // Kiểm tra xem user_id có tồn tại
    const user = await User.findById(searchData.user_id);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }
    // Kiểm tra xem từ khóa đã tồn tại trong lịch sử của người dùng
    const existingSearch = await SearchHistory.findOne({
      user_id: searchData.user_id,
      keyword: searchData.keyword,
    });
    if (existingSearch) {
      // Cập nhật thời gian nếu từ khóa đã tồn tại
      existingSearch.updatedAt = new Date();
      await existingSearch.save();
      return {
        message: "Cập nhật lịch sử tìm kiếm thành công",
        data: existingSearch,
      };
    }
    const searchHistory = await SearchHistory.create(searchData);
    const populatedSearch = await SearchHistory.findById(
      searchHistory._id
    ).populate("user_id", "username avatar_url");
    return {
      message: "Tạo lịch sử tìm kiếm thành công",
      data: populatedSearch,
    };
  } catch (error) {
    throw new Error("Không thể tạo lịch sử tìm kiếm: " + error.message);
  }
};

const getSearchHistoryByUserService = async (user_id) => {
  try {
    // Kiểm tra xem user_id có tồn tại
    const user = await User.findById(user_id);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }
    const searchHistory = await SearchHistory.find({ user_id })
      .populate("user_id", "username avatar_url")
      .sort({ updatedAt: -1 }); // Sắp xếp theo thời gian cập nhật mới nhất
    return {
      message: "Lấy lịch sử tìm kiếm thành công",
      data: searchHistory,
    };
  } catch (error) {
    throw new Error("Không thể lấy lịch sử tìm kiếm: " + error.message);
  }
};

const deleteSearchHistoryService = async (id, user) => {
  try {
    const searchHistory = await SearchHistory.findById(id);
    if (!searchHistory) {
      return {
        message: "Lịch sử tìm kiếm không tồn tại",
        data: null,
      };
    }
    // Kiểm tra quyền: chỉ chủ sở hữu hoặc admin có thể xóa
    if (searchHistory.user_id.toString() !== user.id && user.role !== "admin") {
      return {
        message: "Bạn không có quyền xóa lịch sử tìm kiếm này",
        data: null,
      };
    }
    await SearchHistory.findByIdAndDelete(id);
    return {
      message: "Xóa lịch sử tìm kiếm thành công",
      data: { id },
    };
  } catch (error) {
    throw new Error("Không thể xóa lịch sử tìm kiếm: " + error.message);
  }
};

module.exports = {
  createSearchHistoryService,
  getSearchHistoryByUserService,
  deleteSearchHistoryService,
};
