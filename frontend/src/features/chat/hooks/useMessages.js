import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMessagesByChatRoom,
  markMessageAsRead,
} from "../services/message.service";
import { useState } from "react";

export const useMessages = (chat_room_id, page = 1, limit = 20) => {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["messages", chat_room_id, page, limit],
    queryFn: async () => {
      console.log("Gọi API getMessagesByChatRoom:", chat_room_id, page, limit);
      const response = await getMessagesByChatRoom(chat_room_id, page, limit);
      console.log("API response:", response);
      setMessages(response?.messages || []);
      return response;
    },
    enabled: !!chat_room_id,
    staleTime: 1000 * 60 * 5, // 5 phút
    cacheTime: 1000 * 60 * 10, // 10 phút
    refetchOnMount: false, // Không refetch khi mount
    refetchOnWindowFocus: false,
  });

  const markMessageAsReadMutation = useMutation({
    mutationFn: (chat_room_id) => markMessageAsRead(chat_room_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", chat_room_id, page, limit]);
      queryClient.invalidateQueries(["chatRooms"]);
    },
    onError: (error) => {
      console.error("Lỗi khi đánh dấu đã đọc:", error.message);
    },
  });

  return {
    messages,
    setMessages,
    pagination: data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
    loading: isLoading || isFetching,
    error: error?.message || null,
    markMessageAsRead: markMessageAsReadMutation.mutateAsync,
    markMessageAsReadLoading: markMessageAsReadMutation.isPending,
    markMessageAsReadError: markMessageAsReadMutation.error?.message || null,
  };
};
