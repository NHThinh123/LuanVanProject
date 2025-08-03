import React from "react";
import { Row, Col, Typography, Divider, Spin, Skeleton } from "antd";
import { useInView } from "react-intersection-observer";
import PostList from "../features/home/components/templates/PostList";
import { usePosts } from "../features/post/hooks/usePost";

const { Title } = Typography;

const PostLikedPage = () => {
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
    liked: true,
    status: "accepted",
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPostsLoading) {
    return (
      <Row justify="center" gutter={[16, 16]}>
        <Col span={16} style={{ padding: "0px 24px" }}>
          <Typography.Title level={2}>Bài viết đã thích</Typography.Title>
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col span={16} style={{ padding: "0px 24px" }}>
        <Title level={2} style={{ color: "#1D267D" }}>
          Bài viết đã thích
        </Title>
        <Divider />
        <PostList posts={posts} isLoading={isPostsLoading} />
        <div ref={ref} style={{ height: 20, textAlign: "center" }}>
          {isFetchingNextPage && <Spin />}
          {!hasNextPage && posts.length > 0 && (
            <Typography.Text type="secondary">
              Không còn bài viết để tải
            </Typography.Text>
          )}
          {!hasNextPage && posts.length === 0 && (
            <Typography.Text type="secondary">
              Bạn chưa thích bài viết nào
            </Typography.Text>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default PostLikedPage;
