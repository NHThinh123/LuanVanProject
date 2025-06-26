import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMajors, createMajor } from "../services/major.service";
import { notification } from "antd";

export const useMajor = () => {
  const [major, setMajor] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMajor, setNewMajor] = useState("");
  const queryClient = useQueryClient();

  // Lấy danh sách ngành học
  const { data: majors, isLoading: majorsLoading } = useQuery({
    queryKey: ["majors"],
    queryFn: getAllMajors,
    select: (data) =>
      data.map((maj) => ({ id: maj._id, name: maj.major_name })),
  });

  // Mutation để tạo ngành học mới
  const createMajorMutation = useMutation({
    mutationFn: createMajor,
    onSuccess: (data) => {
      if (data.EC === 0) {
        queryClient.invalidateQueries(["majors"]);
        setMajor(data.data.major_name);
        setIsModalVisible(false);
        setNewMajor("");
        notification.success({
          message: "Thành công",
          description: "Thêm ngành học thành công",
        });
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Thêm ngành học thất bại",
      });
    },
  });

  const onSelect = (value) => {
    setMajor(value);
  };

  const onSearch = (value) => {
    setMajor(value);
  };

  const filterOptions = (inputValue) => {
    return (majors || []).filter((maj) =>
      maj.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (newMajor.trim()) {
      createMajorMutation.mutate(newMajor.trim());
    }
  };

  const handleModalCancel = () => {
    setNewMajor("");
    setIsModalVisible(false);
  };

  return {
    major,
    majors,
    majorsLoading,
    isModalVisible,
    newMajor,
    setMajor,
    setNewMajor,
    onSelect,
    onSearch,
    filterOptions,
    showModal,
    handleModalOk,
    handleModalCancel,
    createMajorLoading: createMajorMutation.isLoading,
  };
};
