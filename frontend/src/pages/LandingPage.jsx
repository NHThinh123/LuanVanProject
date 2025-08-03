import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Button,
  AutoComplete,
  Input,
  Dropdown,
  Carousel,
  Skeleton,
  Card,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  BookCopy,
  LogOut,
  PenLine,
  UserRoundPen,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Share2,
  Brain,
  FileText,
} from "lucide-react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSearchHistory } from "../features/searching/hooks/useSearchHistory";
import { usePosts } from "../features/post/hooks/usePost";

import SuggestedPostList from "../features/post/components/templates/SuggestedPostList";

import logo from "../assets/Logo/Logo.png";
import FooterCustom from "../components/molecules/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const LandingPage = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth < 1200);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuthContext();
  const { handleLogout } = useAuth();
  const { searchHistory, addSearchHistory } = useSearchHistory();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoCompleteRef = useRef(null);

  // Fetch posts and users
  const { posts, isLoading: isPostsLoading } = usePosts({ status: "accepted" });

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setSearchValue(keyword);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 600;
      const isDesktopView = window.innerWidth < 1200;
      setIsMobile(isMobileView);
      setIsDesktop(isDesktopView);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const dropdownItems = [
    {
      key: "1",
      label: (
        <Space>
          <UserRoundPen strokeWidth={1.25} />
          <Link to="/profile/edit" style={{ color: "inherit" }}>
            Thông tin cá nhân
          </Link>
        </Space>
      ),
    },
    {
      key: "2",
      label: (
        <Space>
          <BookCopy strokeWidth={1.25} />
          <Link to="/profile" style={{ color: "inherit" }}>
            Quản lý bài viết
          </Link>
        </Space>
      ),
    },
    {
      key: "3",
      label: (
        <Space>
          <PenLine strokeWidth={1.25} />
          <Link to="/posts/pending" style={{ color: "inherit" }}>
            Bài viết chờ kiểm duyệt
          </Link>
        </Space>
      ),
    },
    {
      key: "4",
      label: (
        <Space>
          <LogOut strokeWidth={1.25} />
          <Button
            type="link"
            onClick={handleLogout}
            style={{ color: "inherit", padding: 0 }}
          >
            Đăng xuất
          </Button>
        </Space>
      ),
    },
  ];

  const handleLogoClick = () => {
    navigate("/landing");
    window.location.reload();
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      title: "Kết nối tri thức, học tập thông minh!",
      subtitle:
        "Tham gia ngay để tìm kiếm tài liệu, chia sẻ mẹo học tập, và kết nối với cộng đồng sinh viên năng động.",
      buttonText: "Đăng ký ngay hôm nay!",
      buttonLink: "/signup",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "AI thông minh giúp bạn tìm kiếm",
      subtitle:
        "Công nghệ AI tiên tiến sẽ gợi ý những bài viết phù hợp nhất với nhu cầu học tập của bạn.",
      buttonText: "Khám phá ngay",
      buttonLink: "/",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Cộng đồng sinh viên sôi động",
      subtitle:
        "Kết nối với hàng nghìn sinh viên trên toàn quốc, chia sẻ kinh nghiệm và cùng nhau phát triển.",
      buttonText: "Tham gia cộng đồng",
      buttonLink: "/signup",
    },
  ];

  // Features data
  const features = [
    {
      icon: <Share2 size={32} color="#2430a2ff" />,
      title: "Chia sẻ kinh nghiệm học tập",
      description:
        "Dễ dàng đăng tải mẹo ôn thi, tài liệu học tập, kinh nghiệm cá nhân để hỗ trợ cùng học.",
    },
    {
      icon: <Brain size={32} color="#2430a2ff" />,
      title: "Gợi ý bài viết thông minh",
      description:
        "Công nghệ AI phân tích sở thích và hành vi của bạn để đề xuất các bài viết học tập phù hợp.",
    },
    {
      icon: <Users size={32} color="#2430a2ff" />,
      title: "Kết nối cộng đồng",
      description:
        "Theo dõi bạn bè, chat trực tuyến, và xây dựng mạng lưới học tập sôi động.",
    },
    {
      icon: <FileText size={32} color="#2430a2ff" />,
      title: "Quản lý nội dung dễ dàng",
      description:
        "Tìm kiếm, tương tác và quản lý bài viết của bạn chỉ trong vài cú nhấp chuột.",
    },
  ];

  // Statistics data
  const stats = [
    {
      icon: <Users size={32} />,
      number: "10,000+",
      label: "Sinh viên tham gia",
    },
    {
      icon: <BookOpen size={32} />,
      number: "5,000+",
      label: "Bài viết chất lượng",
    },
    {
      icon: <TrendingUp size={32} />,
      number: "50,000+",
      label: "Lượt tương tác",
    },
    { icon: <Award size={32} />, number: "100+", label: "Chuyên gia" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          height: 64,
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderBottom: "1px solid #e8ecef",
        }}
      >
        <Row
          align="middle"
          gutter={16}
          justify={"space-between"}
          style={{ height: "100%" }}
        >
          <Col span={isDesktop ? 1 : 6}>
            <Space align="center">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
                style={{ marginRight: 16, color: "#2c3e50" }}
              />
              {!isDesktop && (
                <Link
                  to="/"
                  onClick={handleLogoClick}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src={logo} alt="Logo" style={{ height: 36 }} />
                </Link>
              )}
            </Space>
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
                prefix={<SearchOutlined style={{ color: "#6c757d" }} />}
                placeholder="Tìm kiếm tri thức, dễ dàng và nhanh chóng!"
                onKeyUp={handleKeyPress}
                allowClear
                size="large"
                style={{
                  borderRadius: 24,
                  border: "1px solid #d1d9e0",
                  background: "#fff",
                }}
              />
            </AutoComplete>
          </Col>
          <Col span={isDesktop ? 5 : 3}>
            <Link
              to={"/"}
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#0C134F",
                marginRight: 24,
              }}
            >
              Bài viết
            </Link>
            <Link
              to={"/categories"}
              style={{ fontSize: 16, fontWeight: 500, color: "#0C134F" }}
            >
              Chủ đề
            </Link>
          </Col>
          <Col span={isDesktop ? 5 : 4}>
            {!user ? (
              <Space justify="end" gap={16}>
                <Button
                  type="text"
                  size="large"
                  href="/login"
                  style={{ fontWeight: 500, color: "#2c3e50" }}
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  size="large"
                  href="/signup"
                  style={{
                    fontWeight: 500,
                    background: "#0C134F",
                    border: "none",
                  }}
                >
                  Đăng ký
                </Button>
              </Space>
            ) : (
              <Space justify="end" align="center" gap={16}>
                {!isMobile && (
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: 16,
                      color: "#0C134F",
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
                  <Avatar
                    src={user.avatar_url}
                    size={40}
                    style={{ cursor: "pointer", border: "2px solid #e8ecef" }}
                  />
                </Dropdown>
              </Space>
            )}
          </Col>
        </Row>
      </div>

      <Layout style={{ marginTop: 64 }}>
        <Content style={{ padding: 0, backgroundColor: "#f5f7fa" }}>
          {/* Hero Banner with Carousel */}
          <div style={{ position: "relative", height: "80vh", minHeight: 500 }}>
            <Carousel
              autoplay
              arrows
              autoplaySpeed={5000}
              dots={{ position: "bottom", style: { bottom: 20 } }}
              effect="fade"
            >
              {bannerSlides.map((slide) => (
                <div key={slide.id} style={{ height: "100%" }}>
                  <div
                    style={{
                      height: "80vh",
                      minHeight: 500,
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        color: "white",
                        maxWidth: 1000,
                        padding: "0 24px",
                        zIndex: 2,
                      }}
                    >
                      <Title
                        level={1}
                        style={{
                          color: "white",
                          fontSize: isMobile ? "2rem" : "3.5rem",
                          fontWeight: 700,
                          marginBottom: 16,
                          textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
                        }}
                      >
                        {slide.title}
                      </Title>
                      <Text
                        style={{
                          fontSize: isMobile ? "1rem" : "1.2rem",
                          display: "block",
                          marginBottom: 32,
                          lineHeight: 1.5,
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                          color: "rgba(255,255,255,0.9)",
                        }}
                      >
                        {slide.subtitle}
                      </Text>
                      <Button
                        type="primary"
                        size="large"
                        href={slide.buttonLink}
                        style={{
                          height: 48,
                          fontSize: 16,
                          fontWeight: 500,
                          borderRadius: 8,
                          padding: "0 32px",
                          background: "",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                        }}
                        icon={<ArrowRightOutlined />}
                      >
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Features Section */}
          <div
            style={{
              padding: "60px 24px",

              margin: "0 auto",
              background: "#fff",
            }}
          >
            <Title
              level={2}
              style={{
                textAlign: "center",
                color: "#0C134F",
                marginBottom: 16,
              }}
            >
              Tính năng nổi bật
            </Title>
            <Text
              style={{
                display: "block",
                textAlign: "center",
                color: "#6c757d",
                marginBottom: 32,
                fontSize: "1rem",
              }}
            >
              Khám phá những công cụ giúp bạn học tập hiệu quả và kết nối dễ
              dàng!
            </Text>
            <Row gutter={[24, 24]} justify="center">
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    style={{
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #e8ecef",
                      textAlign: "center",
                      height: "100%",
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <div style={{ marginBottom: 16, color: "#1D267D" }}>
                      {feature.icon}
                    </div>
                    <Title
                      level={4}
                      style={{ color: "#0C134F", marginBottom: 12 }}
                    >
                      {feature.title}
                    </Title>
                    <Text style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                      {feature.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Statistics Section */}
          <div
            style={{
              padding: "60px 24px",
              background: "linear-gradient(135deg, #1D267D 0%, #5C469C 100%)",
            }}
          >
            <Row gutter={[24, 24]} justify="center">
              {stats.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                  <div style={{ textAlign: "center", color: "white" }}>
                    <div
                      style={{
                        marginBottom: 12,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {stat.icon}
                    </div>
                    <Title
                      level={2}
                      style={{
                        color: "white",
                        marginBottom: 8,
                        fontSize: "2rem",
                      }}
                    >
                      {stat.number}
                    </Title>
                    <Text
                      style={{
                        fontSize: "1rem",
                        opacity: 0.9,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {stat.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Main Content */}
          <div
            style={{
              padding: "60px 24px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <Row gutter={[32, 32]} justify="center">
              {/* Suggested Posts Section */}
              <Col xs={24} lg={24}>
                <Title
                  level={2}
                  style={{
                    marginBottom: 16,
                    textAlign: "center",
                    color: "#0C134F",
                  }}
                >
                  Khám phá những bài viết học tập được yêu thích nhất!
                </Title>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 32,
                    fontSize: "1rem",
                    textAlign: "center",
                    color: "#6c757d",
                  }}
                >
                  Từ mẹo ôn thi đến kỹ năng học tập hiệu quả, KNOWEE mang đến
                  những bài viết chất lượng được cộng đồng yêu thích.
                </Text>
                {isPostsLoading ? (
                  <Skeleton active paragraph={{ rows: 4 }} />
                ) : (
                  <SuggestedPostList
                    posts={posts.slice(0, 6)}
                    column={3}
                    hoverable={true}
                  />
                )}
              </Col>
            </Row>

            {/* Call to Action Section */}
            <div
              style={{
                marginTop: 60,
                padding: "48px 32px",
                background: "linear-gradient(135deg, #1D267D 0%, #5C469C 100%)",
                borderRadius: 12,
                textAlign: "center",
                color: "white",
              }}
            >
              <Title level={2} style={{ color: "white", marginBottom: 16 }}>
                Bắt đầu hành trình học tập thông minh với KNOWEE!
              </Title>
              <Text
                style={{
                  fontSize: "1.1rem",
                  display: "block",
                  marginBottom: 24,
                  opacity: 0.9,
                  maxWidth: 600,
                  margin: "0 auto 24px auto",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Đăng ký miễn phí để chia sẻ kinh nghiệm học tập, nhận gợi ý bài
                viết thông minh, và kết nối với cộng đồng sinh viên trên toàn
                quốc!
              </Text>
              <Button
                type="primary"
                size="large"
                href="/signup"
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 500,
                  borderRadius: 8,
                  padding: "0 32px",
                  background: "white",
                  color: "#1e3a8a",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(255,255,255,0.3)",
                }}
                icon={<ArrowRightOutlined />}
              >
                Tham gia ngay
              </Button>
            </div>
          </div>
        </Content>

        {/* Footer */}
        <FooterCustom />
      </Layout>
    </Layout>
  );
};

export default LandingPage;
