import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTags, createTag, addTagsToPost } from "../services/tag.service";

export const useTag = () => {
  const queryClient = useQueryClient();

  // Fetch all tags
  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  });

  // Mutation for creating a new tag
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
    },
  });

  // Mutation for attaching tags to a post
  const addTagsToPostMutation = useMutation({
    mutationFn: addTagsToPost,
    onError: (error) => {
      console.error("Lỗi khi gắn thẻ:", error);
    },
  });

  return {
    tags: tags || [],
    tagsLoading,
    createTag: createTagMutation.mutateAsync,
    addTagsToPost: addTagsToPostMutation.mutateAsync,
  };
};
