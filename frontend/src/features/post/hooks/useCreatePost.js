import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";

import { createPost } from "../services/post.service";

import { useAuthContext } from "../../../contexts/auth.context";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({
          message: "Tạo bài viết thành công",
        });
        queryClient.invalidateQueries(["posts"]);
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi tạo bài viết:", error.message);
      notification.error({
        message: error.message || "Tạo bài viết thất bại, vui lòng thử lại",
      });
    },
  });

  const handleCreatePost = (postData, { onSuccess } = {}) => {
    if (!postData.title || !postData.content) {
      notification.error({
        message: "Vui lòng nhập tiêu đề và nội dung bài viết",
      });
      return;
    }

    if (!user?._id) {
      console.log(user);
      notification.error({
        message: "Vui lòng đăng nhập để tạo bài viết",
      });
      return;
    }

    createPostMutation.mutate(postData, { onSuccess });
  };

  return {
    handleCreatePost,
    isLoading: createPostMutation.isPending,
    error: createPostMutation.error,
  };
};
