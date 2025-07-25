import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse, deleteCourse } from "../services/course.service";
import { notification } from "antd";

export const useCourseActions = () => {
  const queryClient = useQueryClient();

  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, courseData }) =>
      updateCourse(courseId, courseData),
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({
          message: "Cập nhật khóa học thành công",
        });
        queryClient.invalidateQueries(["courses"]);
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Cập nhật khóa học thất bại",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId) => deleteCourse(courseId),
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({
          message: "Xóa khóa học thành công",
        });
        queryClient.invalidateQueries(["courses"]);
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message || "Xóa khóa học thất bại",
      });
    },
  });

  return {
    updateCourse: updateCourseMutation.mutateAsync,
    deleteCourse: deleteCourseMutation.mutateAsync,
    isLoading: updateCourseMutation.isPending || deleteCourseMutation.isPending,
  };
};
