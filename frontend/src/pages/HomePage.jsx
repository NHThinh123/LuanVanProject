// HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Divider,
  Skeleton,
  Spin,
} from "antd";
import { useInView } from "react-intersection-observer";
import PostList from "../features/home/components/templates/PostList";
import PostPopularList from "../features/home/components/templates/PostPopularList";
import UserList from "../features/home/components/templates/UserList";
import { usePosts } from "../features/post/hooks/usePost";
import { useCategories } from "../features/category/hooks/useCategories";
import { useUsers } from "../features/user/hooks/useUsers";
import { useAuthContext } from "../contexts/auth.context";

const { Title } = Typography;

const HomePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const current_user_id = user?._id;
  const { categories, loading: isCategoriesLoading } = useCategories();
  const { users, isLoading: isUserLoading } = useUsers({});
  const [activeTab, setActiveTab] = useState("recommended");

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const {
    posts,
    isLoading: isPostsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts({
    recommend: activeTab === "recommended",
    following: activeTab === "following",
    category_id:
      activeTab !== "recommended" && activeTab !== "following"
        ? activeTab
        : undefined,
    status: "accepted",
  });

  useEffect(() => {
    console.log(
      "inView:",
      inView,
      "hasNextPage:",
      hasNextPage,
      "isFetchingNextPage:",
      isFetchingNextPage
    ); // Debug
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isCategoriesLoading || isUserLoading || authLoading) {
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

  const filteredUsers = current_user_id
    ? users.filter((user) => user._id !== current_user_id)
    : users;

  const tabItems = [
    {
      label: "Dành cho bạn",
      key: "recommended",
      children: (
        <>
          <PostList posts={posts} isLoading={isPostsLoading} />
          <div ref={ref} style={{ height: 20, textAlign: "center" }}>
            {isFetchingNextPage && <Spin />}
            {!hasNextPage && posts.length > 0 && (
              <Typography.Text type="secondary">
                Không còn bài viết để tải
              </Typography.Text>
            )}
          </div>
        </>
      ),
    },
    {
      label: "Đang theo dõi",
      key: "following",
      children: (
        <>
          <PostList posts={posts} isLoading={isPostsLoading} />
          <div ref={ref} style={{ height: 20, textAlign: "center" }}>
            {isFetchingNextPage && <Spin />}
            {!hasNextPage && posts.length > 0 && (
              <Typography.Text type="secondary">
                Không còn bài viết để tải
              </Typography.Text>
            )}
          </div>
        </>
      ),
    },
    ...categories.map((category) => ({
      label: category.category_name,
      key: category._id,
      children: (
        <>
          <PostList posts={posts} isLoading={isPostsLoading} />
          <div ref={ref} style={{ height: 20, textAlign: "center" }}>
            {isFetchingNextPage && <Spin />}
            {!hasNextPage && posts.length > 0 && (
              <Typography.Text type="secondary">
                Không còn bài viết để tải
              </Typography.Text>
            )}
          </div>
        </>
      ),
    })),
  ];

  return (
    <Row gutter={16}>
      <Col span={16} style={{ padding: "0px 24px" }}>
        <Tabs
          defaultActiveKey="recommended"
          items={tabItems}
          onChange={(key) => setActiveTab(key)}
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
        <UserList
          users={filteredUsers?.slice(0, 3)}
          loading={isUserLoading || isPostsLoading}
        />
      </Col>
    </Row>
  );
};

export default HomePage;
