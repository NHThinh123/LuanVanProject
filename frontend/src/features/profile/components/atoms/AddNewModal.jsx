import { Form, Input, Modal } from "antd";
import React from "react";

const AddNewModal = ({
  title,
  visible,
  onOk,
  onCancel,
  value,
  onChange,
  loading,
  placeholder,
  minLength = 10, // Độ dài tối thiểu mặc định
  maxLength = 100, // Độ dài tối đa mặc định
}) => {
  const [form] = Form.useForm();

  // Hàm xử lý khi nhấn OK
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values.input); // Gửi giá trị input lên parent
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="input"
          rules={[
            { required: true, message: "Vui lòng nhập dữ liệu!" },
            {
              min: minLength,
              message: `Độ dài tối thiểu là ${minLength} ký tự!`,
            },
            {
              max: maxLength,
              message: `Độ dài tối đa là ${maxLength} ký tự!`,
            },
          ]}
        >
          <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            size="large"
            maxLength={maxLength} // Giới hạn ký tự nhập trực tiếp
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewModal;
