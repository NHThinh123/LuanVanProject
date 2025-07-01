import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/post.service";
import { notification } from "antd";

export const usePosts = (queryParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", queryParams],
    queryFn: () => getPosts(queryParams),
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
