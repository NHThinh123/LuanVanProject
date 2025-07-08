import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { getPostById } from "../services/post.service";

export const usePostById = (post_id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", post_id],
    queryFn: () => getPostById(post_id),
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
