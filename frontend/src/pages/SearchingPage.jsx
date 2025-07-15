import { Col, Divider, Row, Skeleton, Tabs, Typography } from "antd";
import { useSearchParams } from "react-router-dom"; // Add useSearchParams
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";
import UserList from "../features/home/components/templates/UserList";
import { usePosts } from "../features/post/hooks/usePost";
import { useUsers } from "../features/user/hooks/useUsers";

const SearchingPage = () => {
  const [searchParams] = useSearchParams(); // Get query parameters
  const keyword = searchParams.get("keyword") || ""; // Get keyword from URL
  const { posts, isLoading: isPostsLoading } = usePosts({
    status: "accepted", // Ensure only accepted posts are fetched
    keyword,
  }); // Add keyword to usePosts
  const { users, isLoading: isUsersLoading } = useUsers({ keyword }); // Add keyword to useUsers

  const tabItems = [
    {
      key: "1",
      label: "Bài viết",
      children: <SearchingPostList posts={posts} />,
    },
    {
      key: "2",
      label: "Người dùng",
      children: <SearchingUserList />,
    },
  ];

  if (isPostsLoading || isUsersLoading) {
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
    <Row justify="center" style={{ height: "100vh" }}>
      <Col span={16}>
        <h1>Kết quả tìm kiếm cho "{keyword || "Không có từ khóa"}"</h1>
        <Tabs defaultActiveKey="1" items={tabItems} style={{ marginTop: 16 }} />
      </Col>
      <Col span={6}>
        <div style={{ position: "sticky", top: 80, padding: "0px 16px" }}>
          <div>
            <Typography.Title level={4}>
              Người dùng phù hợp với "{keyword || "Không có từ khóa"}"
            </Typography.Title>
            <UserList users={users} loading={isUsersLoading} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SearchingPage;
