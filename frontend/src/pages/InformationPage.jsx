import React, { useEffect } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUniversity } from "../features/auth/hooks/useUniversity";
import { useMajor } from "../features/auth/hooks/useMajor";
import { Link } from "react-router-dom";
import { Divider, Form, Layout, notification, Row, Typography } from "antd";
import logo from "../assets/Logo/Logo.png";
import BoxCustom from "../components/atoms/BoxCustom";
import ProfileForm from "../features/profile/components/templates/ProfileForm";
import AddNewModal from "../features/profile/components/atoms/AddNewModal";

const InformationPage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const {
    handleUpdateUser,
    isLoading: updateLoading,
    error: updateError,
  } = useAuth();
  const {
    university,
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

  useEffect(() => {
    if (updateError) {
      notification.error({
        message: updateError.message || "Cập nhật thông tin thất bại",
        description: "Vui lòng kiểm tra lại thông tin và thử lại.",
      });
    }
  }, [updateError]);

  const universityDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={showUniversityModal}
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
        onClick={showMajorModal}
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
    handleUpdateUser({
      full_name: values.name,
      university_id: selectedUniversity?.id,
      major_id: selectedMajor?.id,
      start_year:
        values.startYear === "Khác" ? null : parseInt(values.startYear),
    });
  };

  if (authLoading || universitiesLoading || majorsLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Link
        to={"/"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 48, marginRight: 16 }} />
      </Link>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <BoxCustom
          style={{
            width: "500px",
            backgroundColor: "#fff",
          }}
        >
          <Typography.Title
            level={2}
            style={{ textAlign: "center", fontWeight: "bolder" }}
          >
            Thông tin cá nhân
          </Typography.Title>
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
            useRadioForYear
          />
        </BoxCustom>
      </Row>
      <AddNewModal
        title="Thêm trường học mới"
        visible={isUniversityModalVisible}
        onOk={handleUniversityModalOk}
        onCancel={handleUniversityModalCancel}
        value={newUniversity}
        onChange={(e) => setNewUniversity(e.target.value)}
        loading={createUniversityLoading}
        placeholder="Nhập tên trường học mới"
      />
      <AddNewModal
        title="Thêm ngành học mới"
        visible={isMajorModalVisible}
        onOk={handleMajorModalOk}
        onCancel={handleMajorModalCancel}
        value={newMajor}
        onChange={(e) => setNewMajor(e.target.value)}
        loading={createMajorLoading}
        placeholder="Nhập tên ngành học mới"
      />
    </Layout>
  );
};

export default InformationPage;
