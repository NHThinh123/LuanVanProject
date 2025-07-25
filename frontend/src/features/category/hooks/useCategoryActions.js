import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import { notification } from "antd";

export const useCategoryActions = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: (categoryData) => createCategory(categoryData),
    onSuccess: () => {
      notification.success({
        message: "Tạo danh mục thành công",
      });
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ categoryId, categoryData }) =>
      updateCategory(categoryId, categoryData),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật danh mục thành công",
      });
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      notification.success({
        message: "Xóa danh mục thành công",
      });
      queryClient.invalidateQueries(["categories"]);
    },
  });

  return {
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isLoading:
      createCategoryMutation.isPending ||
      updateCategoryMutation.isPending ||
      deleteCategoryMutation.isPending,
  };
};
