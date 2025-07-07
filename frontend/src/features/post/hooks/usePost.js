import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/post.service";
import { notification } from "antd";
import { useAuthContext } from "../../../contexts/auth.context";

export const usePosts = (queryParams = {}) => {
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", queryParams],
    queryFn: () => getPosts({ ...queryParams, current_user_id: user._id }),
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách bài viết thất bại",
      });
    },
  });

  return {
    posts: data || [],
    isLoading,
    error,
  };
};
