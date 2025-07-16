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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Logo/Logo.png";
import { BookCopy, LogOut, PenLine, UserRoundPen } from "lucide-react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSearchHistory } from "../features/searching/hooks/useSearchHistory";
import FooterCustom from "../components/molecules/Footer";

const { Header, Content, Sider } = Layout;

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuthContext();
  const { handleLogout } = useAuth();
  const {
    searchHistory,

    addSearchHistory,
  } = useSearchHistory();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Handle search and save to history
  const handleSearch = async (value) => {
    if (!value.trim()) return; // Ignore empty searches
    try {
      await addSearchHistory(value); // Use mutation to save search history
      setSearchValue(""); // Clear search input
      navigate(`/searching?keyword=${encodeURIComponent(value)}`); // Redirect to search page
    } catch (error) {
      console.error("Lỗi khi lưu lịch sử tìm kiếm:", error);
      navigate(`/searching?keyword=${encodeURIComponent(value)}`); // Still redirect even if saving fails
    }
  };

  // Handle selecting a search history item or pressing Enter
  const handleSelect = (value) => {
    setSearchValue(value);
    handleSearch(value); // Trigger search when selecting an item
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  // Convert search history to AutoComplete options
  const searchOptions = searchHistory.map((item) => ({
    value: item.keyword,
    label: item.keyword,
  }));

  // Map URL paths to menu keys
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/posts")) return "post";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/searching")) return "searching";
    return "home";
  };

  // Handle logo click to reload page
  const handleLogoClick = () => {
    window.location.reload();
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
                to="/"
                onClick={handleLogoClick}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img src={logo} alt="Logo" style={{ height: 42 }} />
              </Link>
            </Flex>
          </Col>
          <Col span={11}>
            <AutoComplete
              options={searchOptions}
              onSelect={handleSelect}
              onChange={(value) => setSearchValue(value)}
              value={searchValue}
              style={{ width: "100%", maxWidth: 500 }}
              filterOption={(inputValue, option) =>
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
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm..."
                onKeyPress={handleKeyPress} // Handle Enter key
              />
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
          <Col span={4}>
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
          <FooterCustom />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
