import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUniversities,
  createUniversity,
} from "../services/university.service";
import { notification } from "antd";

export const useUniversity = () => {
  const [university, setUniversity] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUniversity, setNewUniversity] = useState("");
  const queryClient = useQueryClient();

  // Lấy danh sách trường đại học
  const { data: universities, isLoading: universitiesLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: getAllUniversities,
    select: (data) =>
      data.map((uni) => ({ id: uni._id, name: uni.university_name })),
  });

  // Mutation để tạo trường đại học mới
  const createUniversityMutation = useMutation({
    mutationFn: createUniversity,
    onSuccess: (data) => {
      if (data.EC === 0) {
        queryClient.invalidateQueries(["universities"]);
        setUniversity(data.data.university_name);
        setIsModalVisible(false);
        setNewUniversity("");
        notification.success({
          message: "Thành công",
          description: "Thêm trường đại học thành công",
        });
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Thêm trường đại học thất bại",
      });
    },
  });

  const onSelect = (value) => {
    setUniversity(value);
  };

  const onSearch = (value) => {
    setUniversity(value);
  };

  const filterOptions = (inputValue) => {
    return (universities || []).filter((uni) =>
      uni.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = (newUniversityName) => {
    if (newUniversityName?.trim()) {
      createUniversityMutation.mutate(newUniversityName.trim());
    }
  };

  const handleModalCancel = () => {
    setNewUniversity("");
    setIsModalVisible(false);
  };

  return {
    university,
    universities,
    universitiesLoading,
    isModalVisible,
    newUniversity,
    setUniversity,
    setNewUniversity,
    onSelect,
    onSearch,
    filterOptions,
    showModal,
    handleModalOk,
    handleModalCancel,
    createUniversityLoading: createUniversityMutation.isPending,
  };
};
