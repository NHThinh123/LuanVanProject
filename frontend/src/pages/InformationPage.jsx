import { useState } from "react";
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
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo/Logo.png";

const { Option } = AutoComplete;

const InformationPage = () => {
  const [university, setUniversity] = useState("");
  const [mockUniversities, setMockUniversities] = useState([
    "HCMC University of Physical Education and Sport",
    "Trường Đại học An Giang",
    "VNU University of Engineering and Technology",
    "UEF - University of Economics and Finance",
    "Học viện Tòa án",
    "ĐẠI HỌC ĐỒNG Á",
    "University of Social Sciences and Humanities",
    "Học viện Âm nhạc quốc gia",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUniversity, setNewUniversity] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 },
    (_, i) => currentYear - i
  ).concat("Khác");
  const navigate = useNavigate();

  const onSelect = (value) => {
    setUniversity(value);
  };

  const onSearch = (value) => {
    setUniversity(value);
  };

  const filterOptions = (inputValue) => {
    return mockUniversities.filter((uni) =>
      uni.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (newUniversity.trim()) {
      setMockUniversities([...mockUniversities, newUniversity.trim()]);
      setUniversity(newUniversity.trim());
      setNewUniversity("");
      setIsModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setNewUniversity("");
    setIsModalVisible(false);
  };

  // Tùy chỉnh dropdown của AutoComplete
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

  return (
    <>
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
            initialValues={{ remember: false }}
            onFinish={(values) => {
              console.log("Login values:", values);
              navigate("/");
            }}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn " },
              ]}
            >
              <Input
                type="name"
                placeholder="Nhập họ và tên của bạn"
                size="large"
              />
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
                dropdownRender={dropdownRender}
              >
                {filterOptions(university).map((university) => (
                  <Option key={university} value={university}>
                    {university}
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
              <Button type="primary" htmlType="submit" block size="large">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </BoxCustom>
      </Row>

      <Modal
        title="Thêm trường học mới"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tên trường học mới"
          value={newUniversity}
          onChange={(e) => setNewUniversity(e.target.value)}
          size="large"
        />
      </Modal>
    </>
  );
};

export default InformationPage;
