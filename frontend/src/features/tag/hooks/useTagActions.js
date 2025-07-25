import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag, deleteTag } from "../services/tag.service";
import { notification } from "antd";

export const useTagActions = () => {
  const queryClient = useQueryClient();

  const updateTagMutation = useMutation({
    mutationFn: ({ tagId, tagData }) => updateTag(tagId, tagData),
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({
          message: "Cập nhật thẻ thành công",
        });
        queryClient.invalidateQueries(["tags"]);
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Cập nhật thẻ thất bại",
      });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId) => deleteTag(tagId),
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({
          message: "Xóa thẻ thành công",
        });
        queryClient.invalidateQueries(["tags"]);
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Xóa thẻ thất bại",
      });
    },
  });

  return {
    updateTag: updateTagMutation.mutateAsync,
    deleteTag: deleteTagMutation.mutateAsync,
    isLoading: updateTagMutation.isPending || deleteTagMutation.isPending,
  };
};
