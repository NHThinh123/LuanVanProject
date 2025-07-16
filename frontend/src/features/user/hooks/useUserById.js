import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { getUserById } from "../services/user.service";

export const useUserById = (user_id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", user_id],
    queryFn: () => getUserById(user_id),

    onError: (error) => {
      notification.error({
        message: error.message || "Lấy thông tin người dùng thất bại",
      });
    },
  });

  return {
    user: data || null,
    isLoading,
    error,
  };
};
