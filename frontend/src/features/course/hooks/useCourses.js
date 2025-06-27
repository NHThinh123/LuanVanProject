import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCourses, createCourse } from "../services/course.service";
import { notification } from "antd";

export const useCourses = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const addCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({ message: "Thêm khóa học thành công" });
        queryClient.invalidateQueries(["courses"]);
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Thêm khóa học thất bại",
      });
    },
  });

  const addCourse = (data) => {
    addCourseMutation.mutate(data);
  };

  return {
    courses: data || [],
    loading: isLoading,
    addCourse,
  };
};
