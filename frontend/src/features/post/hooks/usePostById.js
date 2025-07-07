import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { getPostById } from "../services/post.service";
import { useAuthContext } from "../../../contexts/auth.context";

export const usePostById = (post_id) => {
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", post_id],
    queryFn: () => getPostById(post_id, user._id),
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy bài viết thất bại",
      });
    },
  });

  return {
    post: data || {},
    isLoading,
    error,
  };
};
