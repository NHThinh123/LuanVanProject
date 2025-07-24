import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Flex,
  Input,
  Row,
  Skeleton,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../features/course/hooks/useCourses";
import { useTag } from "../features/tag/hooks/useTag";
import { useAuthContext } from "../contexts/auth.context";
import { useSearchHistory } from "../features/searching/hooks/useSearchHistory";

const CategorySearchingPage = () => {
  const { courses, loading: coursesLoading } = useCourses();
  const { tags, tagsLoading } = useTag();
  const { user } = useAuthContext();
  const { searchHistory, addSearchHistory } = useSearchHistory();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const autoCompleteRef = useRef(null);

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
      <Row justify="center" gutter={[24, 24]}>
        <Col span={16}>
          <Skeleton paragraph={{ rows: 2 }} active />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify={"center"} gutter={[24, 24]}>
      <Col span={16}>
        <Flex
          vertical
          align="center"
          justify="center"
          flex={1}
          style={{ marginBottom: 48, height: "40vh" }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: 12,
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            Tìm kiếm môn học hoặc chủ đề bạn quan tâm
          </h1>
          <p
            style={{
              textAlign: "center",
              marginBottom: 48,
              color: "#666",
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
            style={{ width: "100%", maxWidth: 800 }}
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
              size="large"
            />
          </AutoComplete>
        </Flex>
      </Col>
      <Col span={20}>
        <Divider />
        <h2 style={{ marginBottom: 24 }}>Các môn học phổ biến</h2>
        <Row gutter={[24, 24]}>
          {courses.map((course) => (
            <Col key={course._id} span={8}>
              <Button
                href={`/posts/course/${course._id}`}
                style={{
                  padding: 40,
                  border: "2px solid #eee",
                  borderRadius: 4,
                  textAlign: "center",
                  color: "inherit",
                }}
                block
              >
                <h3
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                  style={{ cursor: "pointer" }}
                >
                  {course.course_code} - {course.course_name}
                </h3>
              </Button>
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={20}>
        <Divider />
        <h2 style={{ marginBottom: 24 }}>Các chủ đề phổ biến</h2>
        <Flex wrap="wrap" gap={16}>
          {tags.map((tag) => (
            <Button
              key={tag._id}
              variant="outlined"
              color="primary"
              style={{
                margin: 4,
                padding: "20px",
                fontSize: 18,
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
