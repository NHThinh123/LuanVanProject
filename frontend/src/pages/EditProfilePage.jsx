import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUniversity } from "../features/auth/hooks/useUniversity";
import { useMajor } from "../features/auth/hooks/useMajor";

import { Col, Divider, Form, message, Row, Typography } from "antd";
import AddNewModal from "../features/profile/components/atoms/AddNewModal";
import ProfileForm from "../features/profile/components/templates/ProfileForm";

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
    newUniversity,
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
    newMajor,
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

  useEffect(() => {
    if (updateError) {
      message.error(updateError.message);
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
      message.error("Không tìm thấy thông tin người dùng");
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

  const onUniversityModalOk = () => {
    if (newUniversity.trim()) {
      handleUniversityModalOk();
      form.setFieldsValue({ university: newUniversity });
      setUniversity(newUniversity);
    }
  };

  const onMajorModalOk = () => {
    if (newMajor.trim()) {
      handleMajorModalOk();
      form.setFieldsValue({ major: newMajor });
      setMajor(newMajor);
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
        value={newUniversity}
        onChange={(e) => setNewUniversity(e.target.value)}
        loading={createUniversityLoading}
        placeholder="Nhập tên trường học mới"
      />
      <AddNewModal
        title="Thêm ngành học mới"
        visible={isMajorModalVisible}
        onOk={onMajorModalOk}
        onCancel={handleMajorModalCancel}
        value={newMajor}
        onChange={(e) => setNewMajor(e.target.value)}
        loading={createMajorLoading}
        placeholder="Nhập tên ngành học mới"
      />
    </div>
  );
};

export default EditProfilePage;
