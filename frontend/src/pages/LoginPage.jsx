import React from "react";
import BoxCustom from "../components/atoms/BoxCustom";
import { Button, Divider, Form, Input, Layout, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/Logo/Logo.png";
const LoginPage = () => {
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
              onFinish={(values) => {
                console.log("Login values:", values);
              }}
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn" },
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
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu của bạn"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Typography.Text style={{ textAlign: "center", display: "block" }}>
              Chưa có tài khoản? <Link to={"/signup"}>Đăng ký ngay</Link>
            </Typography.Text>
          </BoxCustom>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default LoginPage;
