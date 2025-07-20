import { useState } from "react";
import { notification } from "antd";
import {
  updatePost,
  deletePost,
  updatePostStatus,
} from "../services/post.service";

export const usePostActions = (queryClient) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm xử lý xóa bài viết
  const deletePostAction = async (postId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deletePost(postId);
      if (response.EC === 0) {
        notification.success({
          message: "Xóa bài viết thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        return response;
      } else {
        notification.error({
          message: response.message || "Xóa bài viết thất bại",
        });
        setError(response.message);
        return response;
      }
    } catch (error) {
      notification.error({
        message: "Lỗi server khi xóa bài viết",
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý cập nhật bài viết
  const updatePostAction = async (postId, postData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updatePost(postId, postData);
      if (response.EC === 0) {
        notification.success({
          message: "Cập nhật bài viết thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        return response;
      } else {
        notification.error({
          message: response.message || "Cập nhật bài viết thất bại",
        });
        setError(response.message);
        return response;
      }
    } catch (error) {
      notification.error({
        message: "Lỗi server khi cập nhật bài viết",
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý cập nhật trạng thái bài viết
  const updatePostStatusAction = async (postId, status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updatePostStatus(postId, status);
      if (response.EC === 0) {
        notification.success({
          message: `Cập nhật trạng thái bài viết thành công`,
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        return response;
      } else {
        notification.error({
          message: response.message || "Cập nhật trạng thái bài viết thất bại",
        });
        setError(response.message);
        return response;
      }
    } catch (error) {
      notification.error({
        message: "Lỗi server khi cập nhật trạng thái bài viết",
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deletePostAction,
    updatePostAction,
    updatePostStatusAction,
    isLoading,
    error,
  };
};
