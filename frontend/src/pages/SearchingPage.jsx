import {
  Button,
  Col,
  Divider,
  Flex,
  List,
  Row,
  Skeleton,
  Tabs,
  Typography,
  Collapse,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";
import SearchingTagList from "../features/searching/components/templates/SearchingTagList";
import SearchingCourseList from "../features/searching/components/templates/SearchingCourseList";
import UserList from "../features/home/components/templates/UserList";
import { usePosts } from "../features/post/hooks/usePost";
import { useUsers } from "../features/user/hooks/useUsers";
import { useTag } from "../features/tag/hooks/useTag";
import { useCourses } from "../features/course/hooks/useCourses";

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

const SearchingPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { posts, isLoading: isPostsLoading } = usePosts({
    status: "accepted",
    keyword,
  });
  const { users, isLoading: isUsersLoading } = useUsers({ keyword });
  const { tags, tagsLoading: isTagsLoading } = useTag({ keyword });
  const { courses, loading: isCoursesLoading } = useCourses({ keyword });

  // Quản lý trạng thái tab active, mặc định là tab "Bài viết"
  const [activeTab, setActiveTab] = useState("1");

  // Lấy kích thước màn hình
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

  const tabItems = [
    {
      key: "1",
      label: `Bài viết (${posts?.length || 0})`,
      children: <SearchingPostList posts={posts} />,
    },
    {
      key: "2",
      label: `Người dùng (${users?.length || 0})`,
      children: <SearchingUserList users={users} />,
    },
    {
      key: "3",
      label: `Thẻ (${tags?.length || 0})`,
      children: <SearchingTagList tags={tags} keyword={keyword} />,
    },
    {
      key: "4",
      label: `Khóa học (${courses?.length || 0})`,
      children: <SearchingCourseList courses={courses} />,
    },
  ];

  if (isPostsLoading || isUsersLoading || isTagsLoading || isCoursesLoading) {
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
          <Divider />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
        </Col>
        {!isMobile && (
          <Col
            span={isTablet ? 4 : 6}
            style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
          >
            <Skeleton paragraph={{ rows: isMobile ? 2 : 3 }} active />
            <Divider />
            <Skeleton paragraph={{ rows: isMobile ? 2 : 3 }} active />
          </Col>
        )}
      </Row>
    );
  }

  // Nội dung cột bên phải (gợi ý) để hiển thị trong Collapse trên mobile
  const suggestionContent = (
    <div style={{ padding: isMobile ? "0px 12px" : "0px 16px" }}>
      <div>
        <Typography.Title
          level={isMobile ? 5 : 4}
          style={{ marginBottom: isMobile ? 12 : 16, color: "#1D267D" }}
        >
          Người dùng phù hợp với "{keyword || "Không có từ khóa"}"
        </Typography.Title>
        <UserList users={users?.slice(0, 4)} loading={isUsersLoading} />
        {users?.length > 4 && (
          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              cursor: "pointer",
              marginTop: isMobile ? 8 : 12,
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
            }}
            onClick={() => setActiveTab("2")}
          >
            Xem thêm
          </p>
        )}
      </div>
      <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
      <div style={{ marginTop: isMobile ? 12 : 24, color: "#1D267D" }}>
        <Typography.Title
          level={isMobile ? 5 : 4}
          style={{ marginBottom: isMobile ? 12 : 16 }}
        >
          Thẻ phù hợp với "{keyword || "Không có từ khóa"}"
        </Typography.Title>
        {tags && tags.length > 0 ? (
          <>
            <Flex wrap="wrap" gap={isMobile ? 6 : 8}>
              {tags.slice(0, 4).map((tag) => (
                <Button
                  variant="outlined"
                  color="primary"
                  key={tag._id}
                  style={{
                    margin: 4,
                    padding: isMobile ? "4px 8px" : "6px 12px",
                    fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                    borderRadius: 24,
                  }}
                  href={`/posts/tag/${tag._id}?keyword=${keyword}`}
                >
                  {tag.tag_name} ({tag.post_count || 0})
                </Button>
              ))}
            </Flex>
            {tags.length > 4 && (
              <p
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginTop: isMobile ? 8 : 12,
                  fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                }}
                onClick={() => setActiveTab("3")}
              >
                Xem thêm
              </p>
            )}
          </>
        ) : (
          <Typography.Text
            type="secondary"
            style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
          >
            Không có thẻ phù hợp
          </Typography.Text>
        )}
      </div>
      <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
      <div style={{ marginTop: isMobile ? 12 : 24 }}>
        <Typography.Title
          level={isMobile ? 5 : 4}
          style={{ marginBottom: isMobile ? 12 : 16, color: "#1D267D" }}
        >
          Khóa học phù hợp với "{keyword || "Không có từ khóa"}"
        </Typography.Title>
        {courses && courses.length > 0 ? (
          <>
            <List
              dataSource={courses.slice(0, 4)}
              renderItem={(course) => (
                <List.Item style={{ padding: isMobile ? "4px 0" : "8px 0" }}>
                  <Typography.Text
                    strong
                    style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
                  >
                    {course.course_name}
                  </Typography.Text>
                  {course.course_code && (
                    <Typography.Text
                      type="secondary"
                      style={{
                        marginLeft: 8,
                        fontSize: isMobile ? 12 : isTablet ? 14 : 16,
                      }}
                    >
                      ({course.course_code})
                    </Typography.Text>
                  )}
                </List.Item>
              )}
            />
            {courses.length > 4 && (
              <p
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginTop: isMobile ? 8 : 12,
                  fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                }}
                onClick={() => setActiveTab("4")}
              >
                Xem thêm
              </p>
            )}
          </>
        ) : (
          <Typography.Text
            type="secondary"
            style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
          >
            Không có khóa học phù hợp
          </Typography.Text>
        )}
      </div>
    </div>
  );

  return (
    <Row justify="center" style={{ marginTop: 20 }} gutter={[16, 16]}>
      <Col
        span={isMobile ? 24 : isTablet ? 20 : isDesktop ? 20 : 16}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <Typography.Title
          level={isMobile ? 3 : 2}
          style={{
            fontSize: isMobile ? 24 : isTablet ? 32 : 40,
            marginBottom: isMobile ? 12 : 16,
            color: "#1D267D",
          }}
        >
          Kết quả tìm kiếm cho "{keyword || "Không có từ khóa"}"
        </Typography.Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginTop: isMobile ? 12 : 16 }}
          tabBarStyle={{
            fontSize: isMobile ? 14 : isTablet ? 16 : 18,
            padding: isMobile ? "0 8px" : "0 16px",
          }}
        />
        {isMobile && (
          <Collapse
            style={{ marginTop: isMobile ? 12 : 16 }}
            items={[
              {
                key: "1",
                label: (
                  <Typography.Text
                    strong
                    style={{ fontSize: isMobile ? 14 : 16 }}
                  >
                    Gợi ý tìm kiếm
                  </Typography.Text>
                ),
                children: suggestionContent,
              },
            ]}
          />
        )}
      </Col>
      {!isTablet && (
        <Col
          span={6}
          style={{
            padding: isTablet ? "0px 12px" : "0px 24px",
            position: "sticky",
            top: 80,
          }}
        >
          {suggestionContent}
        </Col>
      )}
    </Row>
  );
};

export default SearchingPage;
