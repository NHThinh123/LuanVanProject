import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserChatRooms,
  createChatRoom,
} from "../services/chat_room.service";

export const useChatRoom = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chatRooms", page, limit],
    queryFn: () => getUserChatRooms(page, limit),
  });

  const createChatRoomMutation = useMutation({
    mutationFn: ({ member_id }) => createChatRoom({ member_id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["chatRooms", page, limit]);
    },
    onError: (error) => {
      console.error("Lỗi khi tạo phòng chat:", error.message);
    },
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
    createChatRoom: createChatRoomMutation.mutateAsync,
    createChatRoomLoading: createChatRoomMutation.isPending,
    createChatRoomError: createChatRoomMutation.error?.message || null,
  };
};
