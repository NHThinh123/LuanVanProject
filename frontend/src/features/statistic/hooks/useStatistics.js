import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { getStatistics } from "../services/statistics.service";

export const useStatistics = ({ range, tab }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["statistics", range, tab], // Sử dụng range trực tiếp
    queryFn: () => getStatistics({ range }), // Sử dụng range trực tiếp

    onError: (error) => {
      notification.error({
        message: error.message || "Lấy dữ liệu thống kê thất bại",
      });
    },
    select: (data) => {
      if (!data || typeof data !== "object") {
        return { posts: [], likes: [], tags: [], users: [] };
      }
      return {
        posts: Array.isArray(data.posts) ? data.posts : [],
        likes: Array.isArray(data.likes) ? data.likes : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        users: Array.isArray(data.users) ? data.users : [],
      };
    },
  });

  return {
    statistics: data || { posts: [], likes: [], tags: [], users: [] },
    isLoading,
    error,
  };
};
