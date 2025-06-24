import { useEffect } from "react";
import BoxCustom from "../components/atoms/BoxCustom";
import {
  Button,
  Divider,
  Form,
  Input,
  Layout,
  Radio,
  Row,
  Typography,
  AutoComplete,
  Modal,
  message,
} from "antd";
import { Link } from "react-router-dom";

import logo from "../assets/Logo/Logo.png";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUniversity } from "../features/auth/hooks/useUniversity";

const { Option } = AutoComplete;

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
    isModalVisible,
    newUniversity,
    setNewUniversity,
    onSelect,
    onSearch,
    filterOptions,
    showModal,
    handleModalOk,
    handleModalCancel,
    createUniversityLoading,
  } = useUniversity();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 },
    (_, i) => currentYear - i
  ).concat("Khác");

  useEffect(() => {
    if (updateError) {
      message.error(updateError.message);
    }
  }, [updateError]);

  const dropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={showModal}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có trường của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const onFinish = (values) => {
    const selectedUniversity = (universities || []).find(
      (uni) => uni.name === values.university
    );
    handleUpdateUser({
      id: user?.id,
      full_name: values.name,
      university_id: selectedUniversity?.id,
      start_year:
        values.startYear === "Khác" ? null : parseInt(values.startYear),
    });
  };

  if (authLoading || universitiesLoading) {
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
          <Form
            layout="vertical"
            initialValues={{
              name: user?.full_name || "",
              university: "",
              startYear: user?.start_year || undefined,
            }}
            onFinish={onFinish}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
            >
              <Input placeholder="Nhập họ và tên của bạn" size="large" />
            </Form.Item>
            <Form.Item
              label="Trường học"
              name="university"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trường bạn đang theo học",
                },
              ]}
            >
              <AutoComplete
                value={university}
                onSelect={onSelect}
                onSearch={onSearch}
                placeholder="Nhập tên trường học của bạn"
                size="large"
                style={{ width: "100%" }}
                popupRender={dropdownRender}
              >
                {filterOptions(university).map((uni) => (
                  <Option key={uni.id} value={uni.name}>
                    {uni.name}
                  </Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Năm bắt đầu học"
              name="startYear"
              rules={[
                { required: true, message: "Vui lòng chọn năm bắt đầu học" },
              ]}
            >
              <Radio.Group
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {years.map((year) => (
                  <Radio.Button
                    key={year}
                    value={year}
                    style={{
                      flex: "1 1 25%",
                      textAlign: "center",
                      borderRadius: "20px",
                      borderWidth: "1px",
                    }}
                  >
                    {year}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={updateLoading}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </BoxCustom>
      </Row>
      <Modal
        title="Thêm trường học mới"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={createUniversityLoading}
      >
        <Input
          placeholder="Nhập tên trường học mới"
          value={newUniversity}
          onChange={(e) => setNewUniversity(e.target.value)}
          size="large"
        />
      </Modal>
    </Layout>
  );
};

export default InformationPage;
