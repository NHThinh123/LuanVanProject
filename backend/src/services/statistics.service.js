const Post = require("../models/post.model");
const Tag = require("../models/tag.model");
const User_Like_Post = require("../models/user_like_post.model");
const User = require("../models/user.model");

const getStatisticsService = async ({ range }) => {
  try {
    const ranges = [7, 28, 365];
    if (!ranges.includes(Number(range))) {
      return { message: "Khoảng thời gian không hợp lệ", EC: 1 };
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - range);

    const matchStage = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const groupBy = {
      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
    };

    // Thống kê số bài viết
    const postStats = await Post.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Thống kê số lượt thích
    const likeStats = await User_Like_Post.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Thống kê số tag
    const tagStats = await Tag.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Thống kê số người dùng
    const userStats = await User.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Điền dữ liệu cho các ngày không có bản ghi
    const fillMissingDates = (stats, range) => {
      const result = [];
      for (let i = 0; i < range; i++) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const found = stats.find((item) => item.date === dateStr) || {
          date: dateStr,
          count: 0,
        };
        result.push(found);
      }
      return result.reverse();
    };

    return {
      message: "Lấy thống kê thành công",
      EC: 0,
      data: {
        posts: fillMissingDates(postStats, range),
        likes: fillMissingDates(likeStats, range),
        tags: fillMissingDates(tagStats, range),
        users: fillMissingDates(userStats, range),
      },
    };
  } catch (error) {
    console.error("Error in getStatisticsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = { getStatisticsService };
