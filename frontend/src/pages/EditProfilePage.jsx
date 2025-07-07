import React, { useEffect, useState } from "react";

import { Col, Divider, Form, notification, Row, Typography } from "antd";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUniversity } from "../features/university/hooks/useUniversity";
import { useMajor } from "../features/major/hooks/useMajor";
import ProfileForm from "../features/profile/components/templates/ProfileForm";
import AddNewModal from "../components/organisms/AddNewModal";

const EditProfilePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const {
    handleUpdateUser,
    isLoading: updateLoading,
    error: updateError,
  } = useAuth();
  const {
    university,
    setUniversity,
    universities,
    universitiesLoading,
    isModalVisible: isUniversityModalVisible,
    setNewUniversity,
    onSelect: onSelectUniversity,
    onSearch: onSearchUniversity,
    filterOptions: filterUniversityOptions,
    showModal: showUniversityModal,
    handleModalOk: handleUniversityModalOk,
    handleModalCancel: handleUniversityModalCancel,
    createUniversityLoading,
  } = useUniversity();
  const {
    major,
    setMajor,
    majors,
    majorsLoading,
    isModalVisible: isMajorModalVisible,
    setNewMajor,
    onSelect: onSelectMajor,
    onSearch: onSearchMajor,
    filterOptions: filterMajorOptions,
    showModal: showMajorModal,
    handleModalOk: handleMajorModalOk,
    handleModalCancel: handleMajorModalCancel,
    createMajorLoading,
  } = useMajor();

  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || null);

  // Đồng bộ avatarUrl với user.avatar_url
  useEffect(() => {
    setAvatarUrl(user?.avatar_url || null);
  }, [user?.avatar_url]);

  useEffect(() => {
    if (updateError) {
      notification.error({
        message: "Lỗi",
        description: updateError.message,
      });
    }
  }, [updateError]);

  const universityDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={() => {
          showUniversityModal();
        }}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có trường của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const majorDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={() => {
          showMajorModal();
        }}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có ngành của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const onFinish = (values) => {
    const selectedUniversity = universities.find(
      (uni) => uni.name === values.university
    );
    const selectedMajor = majors.find((maj) => maj.name === values.major);
    if (!user?._id) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
      });
      return;
    }
    const updateData = {
      full_name: values.name,
      university_id: selectedUniversity?.id,
      major_id: selectedMajor?.id,
      start_year:
        values.startYear === "Khác" ? null : parseInt(values.startYear),
      bio: values.bio,
    };
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }
    handleUpdateUser(updateData);
  };

  const onUniversityModalOk = (values) => {
    if (values.name.trim()) {
      setNewUniversity(values.name); // Cập nhật newUniversity để hook xử lý
      handleUniversityModalOk(); // Gọi hàm từ hook để tạo university
      form.setFieldsValue({ university: values.name }); // Cập nhật form
      setUniversity(values.name); // Cập nhật state university
    }
  };

  const onMajorModalOk = (values) => {
    if (values.name.trim()) {
      setNewMajor(values.name); // Cập nhật newMajor để hook xử lý
      handleMajorModalOk(); // Gọi hàm từ hook để tạo major
      form.setFieldsValue({ major: values.name }); // Cập nhật form
      setMajor(values.name); // Cập nhật state major
    }
  };

  if (authLoading || universitiesLoading || majorsLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px" }}>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Thông tin cá nhân
      </Typography.Title>
      <Row justify="center" align="middle">
        <Col span={24}>
          <ProfileForm
            form={form}
            user={user}
            onFinish={onFinish}
            updateLoading={updateLoading}
            universityProps={{
              university,
              onSelect: onSelectUniversity,
              onSearch: onSearchUniversity,
              filterOptions: filterUniversityOptions,
              dropdownRender: universityDropdownRender,
            }}
            majorProps={{
              major,
              onSelect: onSelectMajor,
              onSearch: onSearchMajor,
              filterOptions: filterMajorOptions,
              dropdownRender: majorDropdownRender,
            }}
            showAvatar
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            showBio
          />
        </Col>
      </Row>
      <AddNewModal
        title="Thêm trường học mới"
        visible={isUniversityModalVisible}
        onOk={onUniversityModalOk}
        onCancel={handleUniversityModalCancel}
        loading={createUniversityLoading}
        fields={[{ name: "name", label: "Tên trường học", required: true }]}
        minLength={3}
        maxLength={100}
      />
      <AddNewModal
        title="Thêm ngành học mới"
        visible={isMajorModalVisible}
        onOk={onMajorModalOk}
        onCancel={handleMajorModalCancel}
        loading={createMajorLoading}
        fields={[{ name: "name", label: "Tên ngành học", required: true }]}
        minLength={3}
        maxLength={100}
      />
    </div>
  );
};

export default EditProfilePage;
