import React, { useState } from "react";
import { Layout, Row, Col, Typography, Tabs, Divider, Skeleton } from "antd";
import PostList from "../features/home/components/templates/PostList";
import PostPopularList from "../features/home/components/templates/PostPopularList";
import UserList from "../features/home/components/templates/UserList";
import { usePosts } from "../features/post/hooks/usePost";
import { useCategories } from "../features/category/hooks/useCategories";
import { useUsers } from "../features/user/hooks/useUsers";

const { Title } = Typography;

const HomePage = () => {
  const { categories, loading: isCategoriesLoading } = useCategories();
  const { users, isLoading: isUserLoading } = useUsers({});
  const [activeTab, setActiveTab] = useState("recommended");

  // Chỉ gọi usePosts cho tab hiện tại
  const {
    posts,
    isLoading: isPostsLoading,
    // pagination,
  } = usePosts({
    recommend: activeTab === "recommended",
    category_id: activeTab !== "recommended" ? activeTab : undefined,
    status: "accepted",
    page: 1,
    limit: 10,
  });

  if (isCategoriesLoading || isUserLoading) {
    return (
      <Row justify="center" gutter={[16, 16]}>
        <Col span={16} style={{ padding: "0px 24px" }}>
          <Skeleton active paragraph={{ rows: 1 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
        <Col
          span={8}
          style={{
            padding: "0px 24px",
            maxWidth: 350,
            borderLeft: "1px solid #f0f0f0",
          }}
        >
          <Skeleton active paragraph={{ rows: 3 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 3 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 3 }} />
        </Col>
      </Row>
    );
  }

  const tabItems = [
    {
      label: "Dành cho bạn",
      key: "recommended",
      children: <PostList posts={posts} isLoading={isPostsLoading} />,
    },
    ...categories.map((category) => ({
      label: category.category_name,
      key: category._id,
      children: <PostList posts={posts} isLoading={isPostsLoading} />,
    })),
  ];

  return (
    <Row gutter={16}>
      <Col span={16} style={{ padding: "0px 24px" }}>
        <Tabs
          defaultActiveKey="recommended"
          items={tabItems}
          onChange={(key) => setActiveTab(key)} // Cập nhật tab hiện tại
        />
      </Col>
      <Col
        span={8}
        style={{
          padding: "0px 24px",
          maxWidth: 350,
          borderLeft: "1px solid #f0f0f0",
        }}
      >
        <Title level={4} style={{ marginBottom: 28 }}>
          Bài viết phổ biến
        </Title>
        <PostPopularList
          postPopular={posts?.slice(0, 3)}
          loading={isPostsLoading}
        />
        <Divider />
        <Title level={4} style={{ marginBottom: 28 }}>
          Người dùng nổi bật
        </Title>
        <UserList users={users?.slice(0, 3)} loading={isUserLoading} />
      </Col>
    </Row>
  );
};

export default HomePage;
