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
} from "antd";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";
import SearchingTagList from "../features/searching/components/templates/SearchingTagList";
import SearchingCourseList from "../features/searching/components/templates/SearchingCourseList";
import UserList from "../features/home/components/templates/UserList";
import { usePosts } from "../features/post/hooks/usePost";
import { useUsers } from "../features/user/hooks/useUsers";
import { useTag } from "../features/tag/hooks/useTag";
import { useCourses } from "../features/course/hooks/useCourses";

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
      <Row justify="center" gutter={[24, 24]}>
        <Col span={16}>
          <Skeleton paragraph={{ rows: 2 }} active />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
        <Col span={6}>
          <Skeleton paragraph={{ rows: 3 }} active />
          <Divider />
          <Skeleton paragraph={{ rows: 3 }} active />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{}}>
      <Col span={16}>
        <h1>Kết quả tìm kiếm cho "{keyword || "Không có từ khóa"}"</h1>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginTop: 16 }}
        />
      </Col>
      <Col span={6}>
        <div style={{ position: "sticky", top: 80, padding: "0px 16px" }}>
          <div>
            <Typography.Title level={4}>
              Người dùng phù hợp với "{keyword || "Không có từ khóa"}"
            </Typography.Title>
            <UserList users={users?.slice(0, 4)} loading={isUsersLoading} />
            {users?.length > 4 && (
              <p
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("2")}
              >
                Xem thêm
              </p>
            )}
          </div>
          <Divider />
          <div style={{ marginTop: 24 }}>
            <Typography.Title level={4}>
              Thẻ phù hợp với "{keyword || "Không có từ khóa"}"
            </Typography.Title>
            {tags && tags.length > 0 ? (
              <>
                <Flex wrap="wrap" gap={8}>
                  {tags.slice(0, 4).map((tag) => (
                    <Button
                      variant="outlined"
                      color="primary"
                      key={tag._id}
                      style={{
                        margin: 4,
                        padding: "6px 12px",
                        fontSize: 16,
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
                      marginTop: 8,
                    }}
                    onClick={() => setActiveTab("3")}
                  >
                    Xem thêm
                  </p>
                )}
              </>
            ) : (
              <Typography.Text type="secondary">
                Không có thẻ phù hợp
              </Typography.Text>
            )}
          </div>
          <Divider />
          <div style={{ marginTop: 24 }}>
            <Typography.Title level={4}>
              Khóa học phù hợp với "{keyword || "Không có từ khóa"}"
            </Typography.Title>
            {courses && courses.length > 0 ? (
              <>
                <List
                  dataSource={courses.slice(0, 4)}
                  renderItem={(course) => (
                    <List.Item>
                      <Typography.Text strong>
                        {course.course_name}
                      </Typography.Text>
                      {course.course_code && (
                        <Typography.Text
                          type="secondary"
                          style={{ marginLeft: 8 }}
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
                      marginTop: 8,
                    }}
                    onClick={() => setActiveTab("4")}
                  >
                    Xem thêm
                  </p>
                )}
              </>
            ) : (
              <Typography.Text type="secondary">
                Không có khóa học phù hợp
              </Typography.Text>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SearchingPage;
