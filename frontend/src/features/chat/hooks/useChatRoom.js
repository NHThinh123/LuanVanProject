import { useQuery } from "@tanstack/react-query";
import { getUserChatRooms } from "../services/chat_room.service";

export const useChatRoom = (page = 1, limit = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chatRooms", page, limit],
    queryFn: () => getUserChatRooms(page, limit),
  });

  return {
    chatRooms: data?.chatRooms || [],
    pagination: data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
    loading: isLoading,
    error: error?.message || null,
  };
};
