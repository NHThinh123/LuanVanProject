import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Row,
  Typography,
  AutoComplete,
  Modal,
  message,
  Upload,
  Col,
  Avatar,
  Flex,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUniversity } from "../features/auth/hooks/useUniversity";
import { useMajor } from "../features/auth/hooks/useMajor";

const { Option } = AutoComplete;
const { Option: SelectOption } = Select;

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

  useEffect(() => {
    // Chỉ khởi tạo form một lần khi component mount
    form.setFieldsValue({
      name: user?.full_name || "",
      university: user?.university_id?.university_name || "",
      major: user?.major_id?.major_name || "",
      startYear: user?.start_year?.toString() || "Khác",
    });
    setUniversity(user?.university_id?.university_name || "");
    setMajor(user?.major_id?.major_name || "");
  }, [form, user]);

  const universityDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={() => {
          if (user?.role !== "admin") {
            message.warning("Chỉ admin mới có thể thêm trường học mới!");
            return;
          }
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
          if (user?.role !== "admin") {
            message.warning("Chỉ admin mới có thể thêm ngành học mới!");
            return;
          }
          showMajorModal();
        }}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có ngành của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const onFinish = (values) => {
    const selectedUniversity = (universities || []).find(
      (uni) => uni.name === values.university
    );
    const selectedMajor = (majors || []).find(
      (maj) => maj.name === values.major
    );
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
    };
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }
    handleUpdateUser(updateData);
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      setAvatarUrl(info.file.response.url);
      message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại`);
    }
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
          <Flex justify="center" align="center" vertical>
            <Avatar
              size={100}
              src={avatarUrl || user?.avatar_url}
              style={{ marginBottom: "16px" }}
            />
            <Upload
              name="avatar"
              action="/api/upload/avatar" // Cần triển khai endpoint này
              showUploadList={false}
              onChange={handleAvatarChange}
            >
              <Button icon={<UploadOutlined />}>Tải lên avatar mới</Button>
            </Upload>
          </Flex>
        </Col>
        <Col span={24}>
          <Form
            form={form}
            layout="vertical"
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
                onSelect={(value) => {
                  onSelectUniversity(value);
                  setUniversity(value);
                  form.setFieldsValue({ university: value });
                }}
                onSearch={onSearchUniversity}
                placeholder="Nhập tên trường học của bạn"
                size="large"
                style={{ width: "100%" }}
                dropdownRender={universityDropdownRender}
              >
                {filterUniversityOptions(university).map((uni) => (
                  <Option key={uni.id} value={uni.name}>
                    {uni.name}
                  </Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Ngành học"
              name="major"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngành bạn đang theo học",
                },
              ]}
            >
              <AutoComplete
                value={major}
                onSelect={(value) => {
                  onSelectMajor(value);
                  setMajor(value);
                  form.setFieldsValue({ major: value });
                }}
                onSearch={onSearchMajor}
                placeholder="Nhập tên ngành học của bạn"
                size="large"
                style={{ width: "100%" }}
                dropdownRender={majorDropdownRender}
              >
                {filterMajorOptions(major).map((maj) => (
                  <Option key={maj.id} value={maj.name}>
                    {maj.name}
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
              <Select
                size="large"
                placeholder="Chọn năm bắt đầu học"
                style={{ width: "100%" }}
              >
                {years.map((year) => (
                  <SelectOption key={year} value={year}>
                    {year}
                  </SelectOption>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={updateLoading}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Modal
        title="Thêm trường học mới"
        open={isUniversityModalVisible}
        onOk={onUniversityModalOk}
        onCancel={handleUniversityModalCancel}
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
      <Modal
        title="Thêm ngành học mới"
        open={isMajorModalVisible}
        onOk={onMajorModalOk}
        onCancel={handleMajorModalCancel}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={createMajorLoading}
      >
        <Input
          placeholder="Nhập tên ngành học mới"
          value={newMajor}
          onChange={(e) => setNewMajor(e.target.value)}
          size="large"
        />
      </Modal>
    </div>
  );
};

export default EditProfilePage;
