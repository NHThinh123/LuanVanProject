import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUniversities,
  createUniversity,
} from "../services/university.service";
import { message } from "antd";

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
        message.success("Thêm trường đại học thành công");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      message.error(error.message || "Thêm trường đại học thất bại");
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

  const handleModalOk = () => {
    if (newUniversity.trim()) {
      createUniversityMutation.mutate(newUniversity.trim());
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
    createUniversityLoading: createUniversityMutation.isLoading,
  };
};
