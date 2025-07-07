import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { likePost, unlikePost } from "../services/post.service";
import { useAuthContext } from "../../../contexts/auth.context";

const useLikePostAction = (postId, isLiked) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", postId]);
    },
    onError: (err) => {
      notification.error({
        message: err.message || "Lỗi khi thích bài viết",
      });
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: unlikePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", postId]);
    },
    onError: (err) => {
      notification.error({
        message: err.message || "Lỗi khi bỏ thích bài viết",
      });
    },
  });

  // Hàm xử lý toggle like
  const handleToggleLike = () => {
    if (!user?._id) {
      notification.error({ message: "Vui lòng đăng nhập để thích bài viết" });
      return;
    }
    if (isLiked) {
      unlikeMutation.mutate(postId);
    } else {
      likeMutation.mutate(postId);
    }
  };

  return {
    handleToggleLike,
    isLoading: likeMutation.isPending || unlikeMutation.isPending,
  };
};

export default useLikePostAction;
