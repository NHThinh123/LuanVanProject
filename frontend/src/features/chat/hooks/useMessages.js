import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMessagesByChatRoom,
  sendMessage,
  markMessageAsRead,
} from "../services/message.service";

export const useMessages = (chat_room_id, page = 1, limit = 20) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", chat_room_id, page, limit],
    queryFn: () => getMessagesByChatRoom(chat_room_id, page, limit),
    enabled: !!chat_room_id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ chat_room_id, content }) =>
      sendMessage(chat_room_id, content),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", chat_room_id, page, limit]);
      queryClient.invalidateQueries(["chatRooms"]); // Làm mới danh sách phòng chat
    },
    onError: (error) => {
      console.error("Lỗi khi gửi tin nhắn:", error.message);
    },
  });

  const markMessageAsReadMutation = useMutation({
    mutationFn: (chat_room_id) => markMessageAsRead(chat_room_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", chat_room_id, page, limit]);
      queryClient.invalidateQueries(["chatRooms"]); // Làm mới danh sách phòng chat
    },
    onError: (error) => {
      console.error("Lỗi khi đánh dấu đã đọc:", error.message);
    },
  });

  return {
    messages: data?.messages || [],
    pagination: data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
    loading: isLoading,
    error: error?.message || null,
    sendMessage: sendMessageMutation.mutateAsync,
    sendMessageLoading: sendMessageMutation.isPending,
    sendMessageError: sendMessageMutation.error?.message || null,
    markMessageAsRead: markMessageAsReadMutation.mutateAsync,
    markMessageAsReadLoading: markMessageAsReadMutation.isPending,
    markMessageAsReadError: markMessageAsReadMutation.error?.message || null,
  };
};
