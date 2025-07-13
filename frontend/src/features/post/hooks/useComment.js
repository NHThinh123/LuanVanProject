/* eslint-disable no-unused-vars */
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
  likeComment,
  unlikeComment,
} from "../services/comment.service";
import { notification } from "antd";
import { useAuthContext } from "../../../contexts/auth.context";

export const useComment = (post_id, comment_id = null) => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

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
    onMutate: async (commentData) => {
      await queryClient.cancelQueries(["comments", post_id]);
      if (comment_id) {
        await queryClient.cancelQueries(["replies", comment_id]);
      }
      const previousComments = queryClient.getQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id]
      );
      queryClient.setQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id],
        (old) => ({
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  data: {
                    ...page.data,
                    comments: [
                      {
                        _id: "temp-id",
                        content: commentData.content,
                        user_id: {
                          _id: user._id,
                          full_name: user.full_name,
                          avatar_url: user.avatar_url,
                        },
                        post_id: commentData.post_id,
                        parent_comment_id:
                          commentData.parent_comment_id || null,
                        createdAt: new Date().toISOString(),
                        replyCount: 0,
                        likeCount: 0,
                        isLiked: false,
                      },
                      ...page.comments,
                    ],
                  },
                }
              : page
          ),
        })
      );
      return { previousComments };
    },
    onSuccess: (response) => {
      notification.success({
        message: response.message || "Bình luận đã được gửi",
      });
      queryClient.invalidateQueries(["comments", post_id]);
      if (comment_id) {
        queryClient.invalidateQueries(["replies", comment_id]);
      }
    },
    onError: (error, _, context) => {
      notification.error({
        message: error.message || "Tạo bình luận thất bại",
      });
      queryClient.setQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id],
        context.previousComments
      );
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

  // Mutation để thích bình luận
  const likeCommentMutation = useMutation({
    mutationFn: (comment_id) => likeComment(comment_id),
    onMutate: async (comment_id) => {
      await queryClient.cancelQueries(["comments", post_id]);
      if (comment_id) {
        await queryClient.cancelQueries(["replies", comment_id]);
      }
      const previousComments = queryClient.getQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id]
      );
      queryClient.setQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id],
        (old) => ({
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              comments: page.comments.map((comment) =>
                comment._id === comment_id
                  ? {
                      ...comment,
                      likeCount: comment.likeCount + 1,
                      isLiked: true,
                    }
                  : comment
              ),
            },
          })),
        })
      );
      return { previousComments };
    },
    onSuccess: (response) => {
      // notification.success({
      //   message: response.message || "Thích bình luận thành công",
      // });
      queryClient.invalidateQueries(["comments", post_id]);
      if (comment_id) {
        queryClient.invalidateQueries(["replies", comment_id]);
      }
    },
    onError: (error, _, context) => {
      notification.error({
        message: error.message || "Thích bình luận thất bại",
      });
      queryClient.setQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id],
        context.previousComments
      );
    },
  });

  // Mutation để bỏ thích bình luận
  const unlikeCommentMutation = useMutation({
    mutationFn: (comment_id) => unlikeComment(comment_id),
    onMutate: async (comment_id) => {
      await queryClient.cancelQueries(["comments", post_id]);
      if (comment_id) {
        await queryClient.cancelQueries(["replies", comment_id]);
      }
      const previousComments = queryClient.getQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id]
      );
      queryClient.setQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id],
        (old) => ({
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              comments: page.comments.map((comment) =>
                comment._id === comment_id
                  ? {
                      ...comment,
                      likeCount: comment.likeCount - 1,
                      isLiked: false,
                    }
                  : comment
              ),
            },
          })),
        })
      );
      return { previousComments };
    },
    onSuccess: (response) => {
      // notification.success({
      //   message: response.message || "Bỏ thích bình luận thành công",
      // });
      queryClient.invalidateQueries(["comments", post_id]);
      if (comment_id) {
        queryClient.invalidateQueries(["replies", comment_id]);
      }
    },
    onError: (error, _, context) => {
      notification.error({
        message: error.message || "Bỏ thích bình luận thất bại",
      });
      queryClient.setQueryData(
        comment_id ? ["replies", comment_id] : ["comments", post_id],
        context.previousComments
      );
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
    likeComment: likeCommentMutation.mutate,
    unlikeComment: unlikeCommentMutation.mutate,
    likeCommentLoading: likeCommentMutation.isPending,
    unlikeCommentLoading: unlikeCommentMutation.isPending,
  };
};
