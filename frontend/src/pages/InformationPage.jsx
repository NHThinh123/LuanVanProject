import {
  Layout,
  Menu,
  Button,
  AutoComplete,
  Space,
  Flex,
  Row,
  Col,
  Input,
} from "antd";
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
import { searchHistory } from "../mockups/mockup";

const { Header, Content, Footer, Sider } = Layout;

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  // Xử lý khi chọn một mục trong lịch sử tìm kiếm
  const handleSelect = (value) => {
    setSearchValue(value);
    console.log("Đã chọn từ khóa tìm kiếm:", value);
  };

  // Chuyển đổi searchHistory thành định dạng options cho AutoComplete
  const searchOptions = searchHistory.map((item) => ({
    value: item,
    label: item,
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          borderBottom: "1px solid #e8e8e8",
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
            <AutoComplete
              options={searchOptions}
              onSelect={handleSelect}
              onChange={(value) => setSearchValue(value)}
              value={searchValue}
              style={{ width: "100%", maxWidth: 600 }}
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              filterOption={(inputValue, option) =>
                option.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Col>
          <Col span={6}>
            <Flex justify="end" gap={16}>
              <Button variant="outlined" color="primary" href="/login">
                Đăng nhập
              </Button>
              <Button variant="solid" color="primary" href="/signup">
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
                key: "home",
                icon: <HomeOutlined />,
                label: <Link to="/">Trang chủ</Link>,
              },
              {
                key: "post",
                icon: <AppstoreOutlined />,
                label: <Link to="/posts/a">Bài viết</Link>,
              },
              {
                key: "profile",
                icon: <CommentOutlined />,
                label: <Link to="/profile">Trang cá nhân</Link>,
              },
              {
                key: "searching",
                icon: <SearchOutlined />,
                label: <Link to="/searching">Tìm kiếm</Link>,
              },
              {
                key: "test",
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
              maxWidth: "1600px",
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
            © 2025 Knowee
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
