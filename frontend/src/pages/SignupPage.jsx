import React from "react";
import BoxCustom from "../components/atoms/BoxCustom";
import {
  Button,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Typography,
  message,
} from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/Logo/Logo.png";
import { useAuth } from "../features/auth/hooks/useAuth";

const SignupPage = () => {
  const { handleSignup, isLoading, error } = useAuth();

  React.useEffect(() => {
    if (error) {
      message.error(error.message);
    }
  }, [error]);

  const onFinish = (values) => {
    handleSignup(values);
  };

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
      <Layout.Content>
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
              Đăng ký
            </Typography.Title>
            <Form
              layout="vertical"
              initialValues={{ remember: false }}
              onFinish={onFinish}
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu của bạn"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu của bạn"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isLoading}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Typography.Text
              style={{
                textAlign: "center",
                display: "block",
                color: "#8c8c8c",
              }}
            >
              Bạn đã có tài khoản?{" "}
              <Link
                to={"/login"}
                style={{ color: "#000", textDecoration: "underline" }}
              >
                Đăng nhập ngay
              </Link>
            </Typography.Text>
          </BoxCustom>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default SignupPage;
