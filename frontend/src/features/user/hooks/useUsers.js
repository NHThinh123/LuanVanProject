import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import {
  getUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/user.service";

export const useUsers = (queryParams = {}, user_id) => {
  const queryClient = useQueryClient();

  // Lấy danh sách người dùng
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => getUsers({ ...queryParams }),
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách người dùng phổ biến thất bại",
      });
    },
  });

  // Lấy danh sách người theo dõi
  const {
    data: followersData,
    isLoading: isFollowersLoading,
    error: followersError,
  } = useQuery({
    queryKey: ["followers", user_id],
    queryFn: () => getFollowers(user_id),
    enabled: !!user_id,
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách người theo dõi thất bại",
      });
    },
  });

  // Lấy danh sách người đang theo dõi
  const {
    data: followingData,
    isLoading: isFollowingLoading,
    error: followingError,
  } = useQuery({
    queryKey: ["following", user_id],
    queryFn: () => getFollowing(user_id),
    enabled: !!user_id,
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách người đang theo dõi thất bại",
      });
    },
  });

  // Mutation để theo dõi người dùng
  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      notification.success({
        message: "Theo dõi người dùng thành công",
      });
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["followers", user_id]);
      queryClient.invalidateQueries(["following", user_id]);
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lỗi khi theo dõi người dùng",
      });
    },
  });

  // Mutation để bỏ theo dõi người dùng
  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      notification.success({
        message: "Bỏ theo dõi người dùng thành công",
      });
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["followers", user_id]);
      queryClient.invalidateQueries(["following", user_id]);
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lỗi khi bỏ theo dõi người dùng",
      });
    },
  });

  return {
    users: usersData || [],
    followers: followersData || [],
    following: followingData || [],
    isLoading: isUsersLoading || isFollowersLoading || isFollowingLoading,
    error: usersError || followersError || followingError,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowLoading: followMutation.isLoading || unfollowMutation.isLoading,
  };
};
