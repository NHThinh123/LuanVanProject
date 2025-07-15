import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSearchHistory, getSearchHistory } from "../services/searchHistory";

export const useSearchHistory = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: getSearchHistory,
  });

  const addSearchHistoryMutation = useMutation({
    mutationFn: addSearchHistory,
    onSuccess: () => {
      // Invalidate cache để cập nhật danh sách lịch sử tìm kiếm
      queryClient.invalidateQueries(["searchHistory"]);
    },
    onError: (error) => {
      console.error("Lỗi khi lưu từ khóa tìm kiếm:", error);
    },
  });

  return {
    searchHistory: data || [],
    loading: isLoading,
    addSearchHistory: addSearchHistoryMutation.mutateAsync,
  };
};
