import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getPosts,
  searchPosts,
  getRecommendedPosts,
  getPostsByTag,
  getFollowingPosts,
  getPopularPosts,
  getLikedPosts,
} from "../services/post.service";
import { notification } from "antd";

export const usePosts = (queryParams = {}) => {
  const {
    keyword,
    status,
    category_id,
    user_id,
    tag_id,
    course_id,
    recommend = false,
    following = false,
    popular = false,
    liked = false,
  } = queryParams;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "posts",
      status,
      keyword,
      category_id,
      user_id,
      tag_id,
      course_id,
      recommend,
      following,
      popular,
      liked,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const limit = 6;

      if (recommend) {
        return getRecommendedPosts({ page: pageParam, limit });
      }
      if (following) {
        return getFollowingPosts({ page: pageParam, limit });
      }
      if (popular) {
        return getPopularPosts({ page: pageParam, limit });
      }
      if (liked) {
        return getLikedPosts({ page: pageParam, limit });
      }
      if (keyword) {
        return searchPosts({ keyword, page: pageParam, limit });
      }
      if (tag_id) {
        return getPostsByTag({ tag_id, page: pageParam, limit });
      }
      return getPosts({
        status,
        category_id,
        user_id,
        course_id,
        page: pageParam,
        limit,
      });
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data || lastPage;

      const currentPage = Number(pagination?.page || 1);
      const totalPages = Number(pagination?.totalPages || 1);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách bài viết thất bại",
      });
    },
    select: (data) => ({
      pages: data.pages.map((page) => ({
        posts: page.data?.posts || page.posts || [],
        pagination: page.data?.pagination || page.pagination || {},
      })),
      pageParams: data.pageParams,
    }),
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return {
    posts,
    pagination: data?.pages[data.pages.length - 1]?.pagination || {},
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
