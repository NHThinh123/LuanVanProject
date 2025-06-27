import { Button, Col, Form, Input } from "antd";
import React, { useEffect } from "react";
import AvatarUpload from "../atoms/AvatarUpload";

import YearSelector from "../atoms/YearSelector";
import AutoCompleteField from "../../../../components/organisms/AutoCompleteField";

const { TextArea } = Input;

const ProfileForm = ({
  form,
  user,
  onFinish,
  updateLoading,
  universityProps,
  majorProps,
  showAvatar = false,
  avatarUrl,
  setAvatarUrl,
  useRadioForYear = false,
  showBio = false,
  maxWidth = "400px",
}) => {
  useEffect(() => {
    form.setFieldsValue({
      name: user?.full_name || "",
      university: user?.university_id?.university_name || "",
      major: user?.major_id?.major_name || "",
      startYear: user?.start_year?.toString() || "Khác",
      bio: user?.bio || "",
    });
  }, [form, user]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: maxWidth, margin: "0 auto" }}
    >
      {showAvatar && (
        <Col span={24}>
          <AvatarUpload
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            initialAvatar={user?.avatar_url}
          />
        </Col>
      )}
      <Form.Item
        label="Họ và tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
      >
        <Input placeholder="Nhập họ và tên của bạn" size="large" />
      </Form.Item>
      <AutoCompleteField
        label="Trường học"
        name="university"
        value={universityProps.university}
        onSelect={universityProps.onSelect}
        onSearch={universityProps.onSearch}
        options={universityProps.filterOptions(universityProps.university)}
        placeholder="Nhập tên trường học của bạn"
        dropdownRender={universityProps.dropdownRender}
        rules={[
          { required: true, message: "Vui lòng chọn trường bạn đang theo học" },
        ]}
        form={form}
      />
      {majorProps && (
        <AutoCompleteField
          label="Ngành học"
          name="major"
          value={majorProps.major}
          onSelect={majorProps.onSelect}
          onSearch={majorProps.onSearch}
          options={majorProps.filterOptions(majorProps.major)}
          placeholder="Nhập tên ngành học của bạn"
          dropdownRender={majorProps.dropdownRender}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngành bạn đang theo học",
            },
          ]}
          form={form}
        />
      )}

      <YearSelector useRadio={useRadioForYear} />
      {showBio && (
        <Form.Item
          label="Mô tả bản thân"
          name="bio"
          rules={[
            {
              max: 300,
              message: "Mô tả bản thân không được vượt quá 300 ký tự",
            },
          ]}
        >
          <TextArea
            placeholder="Nhập mô tả bản thân của bạn"
            rows={4}
            maxLength={300}
            showCount
          />
        </Form.Item>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={updateLoading}
        >
          {showAvatar ? "Cập nhật" : "Xác nhận"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
