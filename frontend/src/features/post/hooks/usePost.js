import { useQuery } from "@tanstack/react-query";
import { getPosts, searchPosts } from "../services/post.service";
import { notification } from "antd";

export const usePosts = (queryParams = {}) => {
  const { keyword, status, page = 1, limit = 10 } = queryParams;

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", status, keyword, page, limit],
    queryFn: () => {
      if (keyword) {
        return searchPosts({ keyword, page, limit }); // Use search endpoint if keyword is provided
      }
      return getPosts({ status, page, limit }); // Use regular posts endpoint otherwise
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách bài viết thất bại",
      });
    },
  });

  return {
    posts: data?.posts || [], // Adjust based on response structure
    pagination: data?.pagination || {}, // Include pagination data
    isLoading,
    error,
  };
};
