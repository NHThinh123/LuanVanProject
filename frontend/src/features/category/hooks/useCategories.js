import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../services/category.service";

export const useCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  return {
    categories: data || [],
    loading: isLoading,
  };
};
