import { useQuery } from "@tanstack/react-query";
import {
  getPosts,
  searchPosts,
  getRecommendedPosts,
  getPostsByTag,
} from "../services/post.service";
import { notification } from "antd";

export const usePosts = (queryParams = {}) => {
  const {
    keyword,
    status,
    category_id,
    user_id,
    tag_id,
    page = 1,
    limit = 10,
    recommend = false,
  } = queryParams;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "posts",
      status,
      keyword,
      category_id,
      user_id,
      tag_id,
      page,
      limit,
      recommend,
    ],
    queryFn: () => {
      if (recommend) {
        return getRecommendedPosts({ page, limit }); // Lấy bài viết đề xuất
      }
      if (keyword) {
        return searchPosts({ keyword, page, limit }); // Tìm kiếm bài viết
      }
      if (tag_id) {
        return getPostsByTag({ tag_id, page, limit }); // Lấy bài viết theo tag
      }
      return getPosts({ status, category_id, user_id, page, limit }); // Lấy bài viết theo danh mục hoặc trạng thái
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách bài viết thất bại",
      });
    },
  });

  return {
    posts: data?.posts || [], // Điều chỉnh theo cấu trúc response từ backend
    pagination: data?.pagination || {},
    isLoading,
    error,
  };
};
