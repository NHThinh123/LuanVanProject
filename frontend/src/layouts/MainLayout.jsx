import {
  Layout,
  Menu,
  Button,
  AutoComplete,
  Flex,
  Row,
  Col,
  Input,
  Avatar,
  Dropdown,
} from "antd";
import {
  AppstoreOutlined,
  CommentOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Logo/Logo.png";
import { searchHistory } from "../mockups/mockup";
import {
  BookCopy,
  Braces,
  Clock,
  LogOut,
  PenLine,
  UserRoundPen,
} from "lucide-react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";

const { Header, Content, Footer, Sider } = Layout;

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuthContext();
  const { handleLogout } = useAuth();

  const dropdownItems = [
    {
      key: "1",
      label: (
        <Flex align="center" gap={16} style={{ padding: "4px 8px" }}>
          <UserRoundPen strokeWidth={1.25} />
          <Link to="/profile/edit" style={{ color: "inherit" }}>
            Thông tin cá nhân
          </Link>
        </Flex>
      ),
    },
    {
      key: "2",
      label: (
        <Flex align="center" gap={16} style={{ padding: "4px 8px" }}>
          <BookCopy strokeWidth={1.25} />
          <Link to="/profile" style={{ color: "inherit" }}>
            Quản lý bài viết
          </Link>
        </Flex>
      ),
    },
    {
      key: "3",
      label: (
        <Flex align="center" gap={16} style={{ padding: "4px 8px" }}>
          <LogOut strokeWidth={1.25} />
          <Button
            type="link"
            onClick={handleLogout}
            style={{ color: "inherit", padding: 0 }}
          >
            Đăng xuất
          </Button>
        </Flex>
      ),
    },
  ];
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
              style={{ width: "100%", maxWidth: 500 }}
              filterOption={(inputValue, option) =>
                // Lọc gợi ý, hỗ trợ tiếng Việt
                option.value
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .includes(
                    inputValue
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                  )
              }
            >
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." />
            </AutoComplete>
          </Col>
          <Col span={3}>
            <Flex justify="end">
              <Button variant="outlined" color="primary" href="/posts/create">
                <PenLine strokeWidth={1.25} size={18} />
                Đăng bài
              </Button>
            </Flex>
          </Col>
          <Col span={3}>
            {!user ? (
              <Flex justify="end" gap={16}>
                <Button variant="outlined" color="primary" href="/login">
                  Đăng nhập
                </Button>
                <Button variant="solid" color="primary" href="/signup">
                  Đăng ký
                </Button>
              </Flex>
            ) : (
              <Flex justify="end" align="center" gap={16}>
                <p style={{ fontWeight: 600, fontSize: 16 }}>
                  {user.full_name}
                </p>
                <Dropdown
                  menu={{ items: dropdownItems }}
                  placement="bottomRight"
                >
                  <Avatar src={user.avatar_url} size={40} />
                </Dropdown>
              </Flex>
            )}
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
                label: (
                  <Link to="/posts/685e87fef9fd8be34dad6056">Bài viết</Link>
                ),
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
              // {
              //   key: "test",
              //   icon: <Clock strokeWidth={1.5} size={18} />,
              //   label: <Link to="/test">Testing</Link>,
              // },
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
