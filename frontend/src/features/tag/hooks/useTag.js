import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { getAllTags, createTag, addTagsToPost } from "../services/tag.service";

export const useTag = (query = {}) => {
  const queryClient = useQueryClient();

  // Fetch all tags
  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags", query],
    queryFn: () => getAllTags(query),
    onError: (error) => {
      notification.error({
        message: error.message || "Lấy danh sách thẻ thất bại",
      });
    },
  });

  // Mutation for creating a new tag
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      notification.success({
        message: "Tạo thẻ thành công",
      });
      queryClient.invalidateQueries(["tags"]);
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lỗi khi tạo thẻ",
      });
    },
  });

  // Mutation for attaching tags to a post
  const addTagsToPostMutation = useMutation({
    mutationFn: addTagsToPost,
    onSuccess: () => {
      notification.success({
        message: "Gắn thẻ vào bài viết thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Lỗi khi gắn thẻ vào bài viết",
      });
    },
  });

  return {
    tags: tags || [],
    tagsLoading,
    tagsError,
    createTag: createTagMutation.mutateAsync,
    addTagsToPost: addTagsToPostMutation.mutateAsync,
  };
};
