import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTags, createTag, addTagToPost } from "../services/tag.service";

export const useTag = () => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  });

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
    },
  });

  const addTagToPostMutation = useMutation({
    mutationFn: ({ post_id, tag_id }) => addTagToPost(post_id, tag_id),
  });

  return {
    tags: tags || [],
    tagsLoading,
    createTag: createTagMutation.mutateAsync,
    addTagToPost: addTagToPostMutation.mutateAsync,
    isCreatingTag: createTagMutation.isLoading,
  };
};
