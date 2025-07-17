import axios from "../../../services/axios.customize";

export const getUsers = async (queryParams = {}) => {
  try {
    const response = await axios.get("/users", {
      params: {
        ...queryParams,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi server");
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy thông tin người dùng");
  }
};

export const followUser = async ({ user_follow_id }) => {
  try {
    const response = await axios.post("/follows/follow", { user_follow_id });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi theo dõi người dùng");
  }
};

export const unfollowUser = async ({ user_follow_id }) => {
  try {
    const response = await axios.delete("/follows/unfollow", {
      data: { user_follow_id },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi bỏ theo dõi người dùng");
  }
};

export const checkUserFollow = async ({ user_follow_id }) => {
  try {
    const response = await axios.get("/follows/check", {
      params: { user_follow_id },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi kiểm tra trạng thái theo dõi");
  }
};

export const getFollowers = async (user_id) => {
  try {
    const response = await axios.get(`/follows/followers/${user_id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy danh sách người theo dõi");
  }
};

export const getFollowing = async (user_id) => {
  try {
    const response = await axios.get(`/follows/following/${user_id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.message || "Lỗi khi lấy danh sách người đang theo dõi"
    );
  }
};
