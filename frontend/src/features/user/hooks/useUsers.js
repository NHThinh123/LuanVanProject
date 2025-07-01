import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { getUsers } from "../services/user.service";

export const useUsers = (queryParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => getUsers(queryParams),
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách người dùng phổ biến thất bại",
      });
    },
  });

  return {
    users: data || [],
    isLoading,
    error,
  };
};
