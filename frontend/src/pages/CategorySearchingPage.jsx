import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Flex,
  Input,
  Row,
  Skeleton,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../features/course/hooks/useCourses";
import { useTag } from "../features/tag/hooks/useTag";
import { useAuthContext } from "../contexts/auth.context";
import { useSearchHistory } from "../features/searching/hooks/useSearchHistory";

// Hook để lấy kích thước màn hình
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const CategorySearchingPage = () => {
  const { courses, loading: coursesLoading } = useCourses();
  const { tags, tagsLoading } = useTag();
  const { user } = useAuthContext();
  const { searchHistory, addSearchHistory } = useSearchHistory();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const autoCompleteRef = useRef(null);

  // Lấy kích thước màn hình
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

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

  if (coursesLoading || tagsLoading) {
    return (
      <Row justify="center" gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col
          span={isMobile ? 24 : isTablet ? 20 : isDesktop ? 20 : 16}
          style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
        >
          <Skeleton paragraph={{ rows: isMobile ? 1 : 2 }} active />
          <Divider />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify={"center"} gutter={[16, 16]} style={{ marginTop: 20 }}>
      <Col
        span={isMobile ? 24 : isTablet ? 20 : isDesktop ? 20 : 16}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          flex={1}
          style={{
            marginBottom: isMobile ? 24 : isTablet ? 32 : 48,
            height: isMobile ? "30vh" : "40vh",
          }}
        >
          <Typography.Title
            level={isMobile ? 3 : 2}
            style={{
              textAlign: "center",
              marginBottom: isMobile ? 8 : 12,
              fontSize: isMobile ? 24 : isTablet ? 32 : 40,
              fontWeight: 700,
              color: "#1D267D",
            }}
          >
            Tìm kiếm môn học hoặc chủ đề bạn quan tâm
          </Typography.Title>
          <p
            style={{
              textAlign: "center",
              marginBottom: isMobile ? 24 : 48,
              color: "#666",
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
            }}
          >
            Hàng trăm môn học và chủ đề đang chờ bạn khám phá. Hãy nhập từ khóa
            để bắt đầu tìm kiếm!
          </p>
          <AutoComplete
            ref={autoCompleteRef}
            options={searchOptions}
            onSelect={handleSelect}
            onChange={(value) => setSearchValue(value)}
            value={searchValue}
            style={{
              width: "100%",
              maxWidth: isMobile ? 400 : isTablet ? 600 : 800,
            }}
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
            <Input.Search
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm môn học hoặc chủ đề..."
              onKeyUp={handleKeyPress}
              allowClear
              enterButton={"Tìm kiếm"}
              size={isMobile ? "middle" : "large"}
              style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
            />
          </AutoComplete>
        </Flex>
      </Col>
      <Col
        span={isMobile ? 24 : isTablet ? 22 : 20}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
        <Typography.Title
          level={isMobile ? 3 : 2}
          style={{ marginBottom: isMobile ? 16 : 24, color: "#1D267D" }}
        >
          Các môn học phổ biến
        </Typography.Title>
        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col key={course._id} span={isMobile ? 24 : isTablet ? 12 : 8}>
              <Button
                href={`/posts/course/${course._id}`}
                style={{
                  padding: isMobile ? 20 : isTablet ? 30 : 40,
                  border: "2px solid #eee",
                  borderRadius: 4,
                  textAlign: "center",
                  color: "inherit",
                  height: "auto",
                }}
                block
              >
                <h3
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                  style={{
                    cursor: "pointer",
                    fontSize: isMobile ? 16 : isTablet ? 18 : 20,
                  }}
                >
                  {course.course_code} - {course.course_name}
                </h3>
              </Button>
            </Col>
          ))}
        </Row>
      </Col>
      <Col
        span={isMobile ? 24 : isTablet ? 22 : 20}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
        <Typography.Title
          level={isMobile ? 3 : 2}
          style={{ marginBottom: isMobile ? 16 : 24, color: "#1D267D" }}
        >
          Các chủ đề phổ biến
        </Typography.Title>
        <Flex wrap="wrap" gap={isMobile ? 8 : isTablet ? 12 : 16}>
          {tags.map((tag) => (
            <Button
              key={tag._id}
              variant="outlined"
              color="primary"
              style={{
                margin: 4,
                padding: isMobile
                  ? "10px 16px"
                  : isTablet
                  ? "15px 20px"
                  : "20px",
                fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                borderRadius: 24,
              }}
              href={`/posts/tag/${tag._id}`}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              #{tag.tag_name} ({tag.post_count || 0})
            </Button>
          ))}
        </Flex>
      </Col>
    </Row>
  );
};

export default CategorySearchingPage;
