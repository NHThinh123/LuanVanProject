import React from "react";
import { Layout, Row, Col, Typography, Tabs, Divider } from "antd";

import PostList from "../features/home/components/templates/PostList";
import PostPopularList from "../features/home/components/templates/PostPopularList";
import UserList from "../features/home/components/templates/UserList";
import { topics, featuredUser } from "../mockups/mockup";
import { usePosts } from "../features/post/hooks/usePost";

const { Title } = Typography;

const HomePage = () => {
  // Sử dụng hook usePosts để lấy danh sách bài viết
  const { posts, isLoading } = usePosts({ status: "pending" });

  console.log("Posts:", posts);
  // Chuyển đổi topics thành items cho Tabs
  const tabItems = topics.map((topic, index) => ({
    label: topic,
    key: `${index + 1}`,
    children: <PostList posts={posts} isLoading={isLoading} />,
  }));

  return (
    <Row gutter={16}>
      <Col span={16} style={{ padding: "0px 24px" }}>
        <Tabs defaultActiveKey="1" items={tabItems} />
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
        <PostPopularList postPopular={posts.slice(0, 3)} />
        <Divider />
        <Title level={4} style={{ marginBottom: 28 }}>
          Người dùng nổi bật
        </Title>
        <UserList users={featuredUser} />
      </Col>
    </Row>
  );
};

export default HomePage;
