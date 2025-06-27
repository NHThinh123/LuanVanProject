import { Button, Col, Form, Input, Modal, Row } from "antd";

const AddNewModal = ({
  title,
  visible,
  onOk,
  onCancel,
  loading,

  fields = [{ name: "input", label: "Dữ liệu", required: true }],
  minLength = 3,
  maxLength = 100,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values); // Gửi toàn bộ giá trị form lên parent
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
        {fields.map((field, index) => (
          <Form.Item
            key={index}
            name={field.name}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Vui lòng nhập ${field.label.toLowerCase()}`,
              },
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
              placeholder={
                field.placeholder || `Nhập ${field.label.toLowerCase()}`
              }
              size="large"
              maxLength={maxLength}
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddNewModal;
