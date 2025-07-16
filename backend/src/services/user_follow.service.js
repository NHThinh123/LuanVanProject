const UserFollow = require("../models/user_follow.model");
const User = require("../models/user.model");

const followUserService = async (user_id, user_follow_id) => {
  try {
    // Kiểm tra người dùng và người được theo dõi có tồn tại không
    const user = await User.findById(user_id);
    const userToFollow = await User.findById(user_follow_id);
    if (!user || !userToFollow) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra không tự theo dõi chính mình
    if (user_id.toString() === user_follow_id.toString()) {
      return { message: "Không thể tự theo dõi chính mình", EC: 1 };
    }

    // Kiểm tra xem đã theo dõi chưa
    const existingFollow = await UserFollow.findOne({
      user_id,
      user_follow_id,
    });
    if (existingFollow) {
      return { message: "Bạn đã theo dõi người dùng này", EC: 1 };
    }

    // Thêm theo dõi mới
    const follow = await UserFollow.create({ user_id, user_follow_id });
    return {
      message: "Theo dõi người dùng thành công",
      EC: 0,
      data: follow,
    };
  } catch (error) {
    console.error("Error in followUserService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const unfollowUserService = async (user_id, user_follow_id) => {
  try {
    // Kiểm tra người dùng và người được theo dõi có tồn tại không
    const user = await User.findById(user_id);
    const userToUnfollow = await User.findById(user_follow_id);
    if (!user || !userToUnfollow) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra xem có đang theo dõi không
    const follow = await UserFollow.findOneAndDelete({
      user_id,
      user_follow_id,
    });
    if (!follow) {
      return { message: "Bạn chưa theo dõi người dùng này", EC: 1 };
    }

    return {
      message: "Bỏ theo dõi người dùng thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in unfollowUserService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getFollowersService = async (user_id, current_user_id) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Lấy danh sách người theo dõi
    const followers = await UserFollow.find({ user_follow_id: user_id })
      .populate({
        path: "user_id",
        select: "email role bio full_name start_year avatar_url",
        populate: [
          { path: "university_id", select: "university_name" },
          { path: "major_id", select: "major_name" },
        ],
      })
      .select("user_id");

    // Chuyển đổi danh sách thành cấu trúc phẳng và thêm followers_count, isFollowing
    const followersWithDetails = await Promise.all(
      followers.map(async (follow) => {
        const userData = follow.user_id;
        const followersCount = await UserFollow.countDocuments({
          user_follow_id: userData._id,
        });
        let isFollowing = false;
        if (current_user_id && userData._id.toString() !== current_user_id) {
          const followStatus = await checkUserFollowService(
            current_user_id,
            userData._id
          );
          isFollowing =
            followStatus.EC === 0 ? followStatus.data.following : false;
        }
        return {
          ...userData._doc,
          followers_count: followersCount,
          isFollowing,
        };
      })
    );

    return {
      message: "Lấy danh sách người theo dõi thành công",
      EC: 0,
      data: followersWithDetails,
    };
  } catch (error) {
    console.error("Error in getFollowersService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getFollowingService = async (user_id, current_user_id) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Lấy danh sách người đang theo dõi
    const following = await UserFollow.find({ user_id })
      .populate({
        path: "user_follow_id",
        select: "email role bio full_name start_year avatar_url",
        populate: [
          { path: "university_id", select: "university_name" },
          { path: "major_id", select: "major_name" },
        ],
      })
      .select("user_follow_id");

    // Chuyển đổi danh sách thành cấu trúc phẳng và thêm followers_count, isFollowing
    const followingWithDetails = await Promise.all(
      following.map(async (follow) => {
        const userData = follow.user_follow_id;
        const followersCount = await UserFollow.countDocuments({
          user_follow_id: userData._id,
        });
        let isFollowing = false;
        if (current_user_id && userData._id.toString() !== current_user_id) {
          const followStatus = await checkUserFollowService(
            current_user_id,
            userData._id
          );
          isFollowing =
            followStatus.EC === 0 ? followStatus.data.following : false;
        }
        return {
          ...userData._doc,
          followers_count: followersCount,
          isFollowing,
        };
      })
    );

    return {
      message: "Lấy danh sách người đang theo dõi thành công",
      EC: 0,
      data: followingWithDetails,
    };
  } catch (error) {
    console.error("Error in getFollowingService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const checkUserFollowService = async (user_id, user_follow_id) => {
  try {
    const follow = await UserFollow.findOne({ user_id, user_follow_id });
    return {
      message: "Kiểm tra trạng thái theo dõi thành công",
      EC: 0,
      data: { following: !!follow },
    };
  } catch (error) {
    console.error("Error in checkUserFollowService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  checkUserFollowService,
};
