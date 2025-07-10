import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComment,
  getCommentsByPost,
  getRepliesByComment,
  deleteComment,
} from "../services/comment.service";
import { notification } from "antd";

export const useComment = (post_id, comment_id = null) => {
  const queryClient = useQueryClient();

  // Truy vấn danh sách bình luận hoặc phản hồi
  const commentsQuery = useInfiniteQuery({
    queryKey: comment_id ? ["replies", comment_id] : ["comments", post_id],
    queryFn: ({ pageParam = 1 }) => {
      if (comment_id) {
        return getRepliesByComment(comment_id, { page: pageParam, limit: 10 });
      }
      return getCommentsByPost(post_id, { page: pageParam, limit: 10 });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.pagination) {
        return lastPage.data.pagination.page <
          lastPage.data.pagination.totalPages
          ? lastPage.data.pagination.page + 1
          : undefined;
      }
      return undefined;
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách bình luận thất bại",
      });
    },
  });

  // Mutation để tạo bình luận
  const createCommentMutation = useMutation({
    mutationFn: (commentData) => createComment(commentData),
    onSuccess: (response) => {
      notification.success({
        message: response.message || "Bình luận đã được gửi",
      });
      queryClient.invalidateQueries(["comments", post_id]);
      if (comment_id) {
        queryClient.invalidateQueries(["replies", comment_id]);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Tạo bình luận thất bại",
      });
    },
  });

  // Mutation để xóa bình luận
  const deleteCommentMutation = useMutation({
    mutationFn: (comment_id) => deleteComment(comment_id),
    onSuccess: (response) => {
      notification.success({
        message: response.message || "Xóa bình luận thành công",
      });
      queryClient.invalidateQueries(["comments", post_id]);
      if (comment_id) {
        queryClient.invalidateQueries(["replies", comment_id]);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Xóa bình luận thất bại",
      });
    },
  });

  return {
    comments:
      commentsQuery.data?.pages.flatMap((page) => page?.comments || []) || [],
    pagination: commentsQuery.data?.pages[0]?.data?.pagination || {},
    isLoading: commentsQuery.isLoading,
    error: commentsQuery.error,
    fetchNextPage: commentsQuery.fetchNextPage,
    hasNextPage: commentsQuery.hasNextPage,
    createComment: createCommentMutation.mutate,
    createCommentMutation,
    createCommentLoading: createCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
  };
};
