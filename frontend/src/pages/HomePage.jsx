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

const { Title } = Typography;

const HomePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const current_user_id = user?._id;
  const { categories, loading: isCategoriesLoading } = useCategories();
  const { users, isLoading: isUserLoading } = useUsers({});
  const [activeTab, setActiveTab] = useState(user ? "recommended" : "popular");

  // Lấy kích thước màn hình và định nghĩa các biến responsive
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

  // Cập nhật activeTab khi user hoặc authLoading thay đổi
  useEffect(() => {
    if (!authLoading) {
      setActiveTab(user ? "recommended" : "popular");
    }
  }, [user, authLoading]);

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
    recommend: activeTab === "recommended" && !!user,
    following: activeTab === "following" && !!user,
    popular: activeTab === "popular" && !user,
    category_id:
      activeTab !== "recommended" &&
      activeTab !== "following" &&
      activeTab !== "popular"
        ? activeTab
        : undefined,
    status: "accepted",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isCategoriesLoading || isUserLoading || authLoading) {
    return (
      <Row justify="center" gutter={[16, 16]}>
        <Col
          span={isDesktop ? 24 : 16}
          style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
        >
          <Skeleton active paragraph={{ rows: 1 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
        {!isDesktop && (
          <Col
            span={isTablet ? 6 : 8}
            style={{
              padding: isMobile ? "0px 12px" : "0px 24px",
              maxWidth: isTablet ? 200 : 350,
              borderLeft: "1px solid #f0f0f0",
            }}
          >
            <Skeleton active paragraph={{ rows: 3 }} />
            <Divider />
            <Skeleton active paragraph={{ rows: 3 }} />
            <Divider />
            <Skeleton active paragraph={{ rows: 3 }} />
          </Col>
        )}
      </Row>
    );
  }

  const filteredUsers = current_user_id
    ? users.filter((user) => user._id !== current_user_id)
    : users;

  const tabItems = user
    ? [
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
      ]
    : [
        {
          label: "Bài viết phổ biến",
          key: "popular",
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
    <Row gutter={[16, 16]}>
      <Col
        span={isDesktop ? 24 : 16}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <Tabs
          defaultActiveKey={user ? "recommended" : "popular"}
          items={tabItems}
          onChange={(key) => setActiveTab(key)}
          tabBarStyle={
            isMobile
              ? { fontSize: "14px" }
              : isTablet
              ? { fontSize: "16px" }
              : {}
          }
        />
      </Col>
      {!isDesktop && (
        <Col
          span={isTablet ? 6 : 8}
          style={{
            padding: isMobile ? "0px 12px" : "0px 24px",
            maxWidth: isTablet ? 200 : 350,
            borderLeft: "1px solid #f0f0f0",
          }}
        >
          <Title
            level={isMobile ? 5 : isTablet ? 4 : 3}
            style={{ marginBottom: 28 }}
          >
            Bài viết phổ biến
          </Title>
          <PostPopularList
            postPopular={posts?.slice(0, isTablet ? 2 : 3)}
            loading={isPostsLoading}
          />
          <Divider />
          <Title
            level={isMobile ? 5 : isTablet ? 4 : 3}
            style={{ marginBottom: 28 }}
          >
            Người dùng nổi bật
          </Title>
          <UserList
            users={filteredUsers?.slice(0, isTablet ? 2 : 3)}
            loading={isUserLoading || isPostsLoading}
          />
        </Col>
      )}
    </Row>
  );
};

export default HomePage;
