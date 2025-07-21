import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { deleteUser, updateUser } from "../services/user.service";

export const useUserActions = () => {
  const queryClient = useQueryClient();

  // Mutation để cập nhật người dùng
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật người dùng thành công",
      });
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lỗi khi cập nhật người dùng",
      });
    },
  });

  // Mutation để xóa người dùng
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      notification.success({
        message: "Xóa người dùng thành công",
      });
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lỗi khi xóa người dùng",
      });
    },
  });

  return {
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isLoading: updateUserMutation.isLoading || deleteUserMutation.isLoading,
  };
};
