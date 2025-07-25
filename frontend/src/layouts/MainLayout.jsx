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
  Drawer,
} from "antd";
import {
  CommentOutlined,
  HeartOutlined,
  HomeOutlined,
  MenuOutlined,
  ProfileOutlined,
  SearchOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/Logo/Logo.png";
import { BookCopy, LogOut, PenLine, UserRoundPen } from "lucide-react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSearchHistory } from "../features/searching/hooks/useSearchHistory";
import FooterCustom from "../components/molecules/Footer";

const { Header, Content, Sider } = Layout;

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  // eslint-disable-next-line no-unused-vars
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1000);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth < 1200); // Thêm trạng thái isDesktop
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuthContext();
  const { handleLogout } = useAuth();
  const { searchHistory, addSearchHistory } = useSearchHistory();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setSearchValue(keyword);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      setCollapsed(false);
    }
  }, [user]);

  // Theo dõi kích thước màn hình để chuyển đổi giữa Sider và Drawer
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 600;
      const isTabletView = window.innerWidth < 1000;
      const isDesktopView = window.innerWidth < 1200;

      setIsMobile(isMobileView);
      setIsTablet(isTabletView);
      setIsDesktop(isDesktopView);

      if (isDesktopView) {
        setIsDrawerVisible(false); // Đóng Drawer khi thay đổi kích thước
      } else {
        setCollapsed(false); // Hiển thị Sider khi trên hoặc bằng 1200px
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleSearch = async (value) => {
    if (!value.trim()) return;
    try {
      if (user) {
        await addSearchHistory(value);
      }
      navigate(`/searching?keyword=${encodeURIComponent(value)}`);
      if (autoCompleteRef.current) {
        autoCompleteRef.current.blur();
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch sử tìm kiếm:", error);
      navigate(`/searching?keyword=${encodeURIComponent(value)}`);
      if (autoCompleteRef.current) {
        autoCompleteRef.current.blur();
      }
    }
  };

  const handleSelect = (value) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  const searchOptions = user
    ? searchHistory.map((item) => ({
        value: item.keyword,
        label: item.keyword,
      }))
    : [];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/posts/liked")) return "liked";
    if (path.startsWith("/posts")) return "post";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/searching")) return "searching";
    if (path.startsWith("/categories")) return "categories";
    if (path.startsWith("/messages")) return "messages";
    if (path.startsWith("/followers")) return "followers";
    return "home";
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  const toggleDrawer = () => {
    if (isDesktop) {
      setIsDrawerVisible(!isDrawerVisible);
    } else {
      setCollapsed(!collapsed);
    }
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
        <Row align="middle" gutter={16} justify={"space-between"}>
          <Col span={isDesktop ? 1 : 6}>
            <Flex align="center">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
                style={{ marginRight: 16 }}
              />
              {!isDesktop && (
                <Link
                  to="/"
                  onClick={handleLogoClick}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src={logo} alt="Logo" style={{ height: 42 }} />
                </Link>
              )}
            </Flex>
          </Col>
          <Col span={isMobile ? 10 : 11}>
            <AutoComplete
              ref={autoCompleteRef}
              options={searchOptions}
              onSelect={handleSelect}
              onChange={(value) => setSearchValue(value)}
              value={searchValue}
              style={{ width: "100%", maxWidth: 500 }}
              filterOption={(inputValue, option) =>
                option?.value
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
                onKeyUp={handleKeyPress}
                allowClear
              />
            </AutoComplete>
          </Col>
          <Col span={isDesktop ? 5 : 3}>
            <Flex justify="end">
              {user && (
                <Button
                  size={isMobile ? "small" : "medium"}
                  variant="outlined"
                  color="primary"
                  href="/posts/create"
                  style={{ fontSize: isMobile ? 12 : 14 }}
                >
                  <PenLine
                    strokeWidth={isMobile ? 1 : 1.25}
                    size={isMobile ? 16 : 18}
                  />
                  Đăng bài
                </Button>
              )}
            </Flex>
          </Col>
          <Col span={isDesktop ? 5 : 4}>
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
                {!isMobile && (
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
                )}
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
        {isDesktop ? (
          <Drawer
            placement="left"
            onClose={toggleDrawer}
            open={isDrawerVisible}
            width={200}
            bodyStyle={{ padding: 0 }}
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
                  key: "profile",
                  icon: <UserOutlined />,
                  label: <Link to="/profile">Trang cá nhân</Link>,
                },
                {
                  key: "followers",
                  icon: <TeamOutlined />,
                  label: <Link to="/followers">Người theo dõi</Link>,
                },
                {
                  key: "liked",
                  icon: <HeartOutlined />,
                  label: <Link to="/posts/liked">Bài viết đã thích</Link>,
                },
                {
                  key: "categories",
                  icon: <SearchOutlined />,
                  label: <Link to="/categories">Tìm kiếm</Link>,
                },
                {
                  key: "messages",
                  icon: <CommentOutlined />,
                  label: <Link to="/messages">Tin nhắn</Link>,
                },
              ]}
              onClick={toggleDrawer}
            />
          </Drawer>
        ) : (
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
                  key: "profile",
                  icon: <UserOutlined />,
                  label: <Link to="/profile">Trang cá nhân</Link>,
                },
                {
                  key: "followers",
                  icon: <TeamOutlined />,
                  label: <Link to="/followers">Người theo dõi</Link>,
                },
                {
                  key: "liked",
                  icon: <HeartOutlined />,
                  label: <Link to="/posts/liked">Bài viết đã thích</Link>,
                },
                {
                  key: "categories",
                  icon: <SearchOutlined />,
                  label: <Link to="/categories">Tìm kiếm</Link>,
                },
                {
                  key: "messages",
                  icon: <CommentOutlined />,
                  label: <Link to="/messages">Tin nhắn</Link>,
                },
              ]}
            />
          </Sider>
        )}
        <Layout
          style={{
            marginLeft: isDesktop ? 0 : collapsed ? 80 : 200,
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
