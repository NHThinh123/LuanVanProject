import { Layout, Menu, Button, Input, Space, Flex, Row, Col } from "antd";
import {
  AppstoreOutlined,
  CommentOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Logo/Logo.png";

const { Header, Content, Footer, Sider } = Layout;

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,

          background: "#fff",
          height: 64,
          padding: "0 16px",
        }}
      >
        <Row align="middle">
          <Col span={6}>
            <Flex>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleSider}
                style={{ marginRight: 16 }}
              />
              <img src={logo} alt="Logo" style={{ height: 42 }} />
            </Flex>
          </Col>
          <Col span={12}>
            <Input
              size="large"
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Flex justify="end" gap={16}>
              <Button variant="outlined" size="large">
                Đăng nhập
              </Button>
              <Button variant="solid" color="primary" size="large">
                Đăng ký
              </Button>
            </Flex>
          </Col>
        </Row>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider
          collapsed={collapsed}
          width={200}
          style={{ position: "fixed", top: 64, bottom: 0 }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%" }}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: <Link to="/">Home</Link>,
              },
              {
                key: "2",
                icon: <AppstoreOutlined />,
                label: <Link to="/login">Dashboard</Link>,
              },
              {
                key: "3",
                icon: <CommentOutlined />,
                label: <Link to="/signup">Settings</Link>,
              },
              {
                key: 4,
                label: <Link to="/test">Testing</Link>,
              },
            ]}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: "margin-left 0.3s",
            background: "#fff",
          }}
        >
          <Content
            style={{
              padding: 16,
              backgroundColor: "#fff",
              minHeight: "calc(100vh - 128px)",
            }}
          >
            {children}
          </Content>
          <Footer
            style={{
              textAlign: "center",
              background: "#fff",
            }}
          >
            © 2025 Your Company
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
