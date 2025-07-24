import { Layout, Menu, Button, Flex, Row, Col, Avatar, Dropdown } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  MenuOutlined,
  UserOutlined,
  BarChartOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/Logo/Logo.png";
import { LogOut, UserRoundPen } from "lucide-react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import FooterCustom from "../components/molecules/Footer";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  const { handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Cuộn lên đầu trang khi đường dẫn thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

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

  // Map URL paths to menu keys
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/posts")) return "posts";
    if (path.startsWith("/admin/users")) return "users";
    if (path.startsWith("/admin/moderation")) return "moderation";
    if (path.startsWith("/admin/charts")) return "charts";
    return "posts";
  };

  // Handle logo click to navigate to admin home
  const handleLogoClick = () => {
    navigate("/admin");
  };

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
        <Row align="middle" gutter={16}>
          <Col span={6}>
            <Flex align="center">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleSider}
                style={{ marginRight: 16 }}
              />
              <Link
                to="/admin"
                onClick={handleLogoClick}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img src={logo} alt="Logo" style={{ height: 42 }} />
              </Link>
            </Flex>
          </Col>
          <Col span={14}>
            <Flex align="center">
              <h2 style={{ margin: 0, fontWeight: 600 }}>Admin Dashboard</h2>
            </Flex>
          </Col>
          <Col span={4}>
            {user && (
              <Flex justify="end" align="center" gap={16}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
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
            selectedKeys={[getSelectedKey()]}
            style={{ height: "100%" }}
            items={[
              {
                key: "posts",
                icon: <AppstoreOutlined />,
                label: <Link to="/admin">Quản lý bài viết</Link>,
              },
              {
                key: "users",
                icon: <UserOutlined />,
                label: <Link to="/admin/users">Quản lý người dùng</Link>,
              },
              {
                key: "moderation",
                icon: <SafetyOutlined />,
                label: <Link to="/admin/moderation">Kiểm duyệt bài viết</Link>,
              },
              {
                key: "charts",
                icon: <BarChartOutlined />,
                label: <Link to="/admin/charts">Phân tích</Link>,
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
            <Outlet />
          </Content>
          <FooterCustom />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
