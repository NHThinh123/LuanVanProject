import React from "react";
import BoxCustom from "../components/atoms/BoxCustom";
import { Button, Divider, Form, Input, Layout, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/Logo/Logo.png";
import { useAuth } from "../features/auth/hooks/useAuth";

const LoginPage = () => {
  const { handleLogin, isLoading } = useAuth();

  const onFinish = (values) => {
    handleLogin(values);
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
              Đăng nhập
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
                  { max: 100, message: "Email không được vượt quá 100 ký tự" },
                  { min: 12, message: "Email phải có ít nhất 12 ký tự" },
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
                  { max: 50, message: "Mật khẩu không được vượt quá 50 ký tự" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu của bạn"
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
                  Đăng nhập
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
              Chưa có tài khoản?{" "}
              <Link
                to={"/signup"}
                style={{ color: "#000", textDecoration: "underline" }}
              >
                Đăng ký ngay
              </Link>
            </Typography.Text>
          </BoxCustom>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default LoginPage;
