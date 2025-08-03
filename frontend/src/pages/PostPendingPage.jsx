import React from "react";
import { Row, Col, Typography, Divider, Spin, Skeleton } from "antd";
import { useInView } from "react-intersection-observer";
import PostList from "../features/home/components/templates/PostList";
import { usePosts } from "../features/post/hooks/usePost";

const { Title } = Typography;

const PostPendingPage = () => {
  // Hook để theo dõi cuộn cho bài viết đang kiểm duyệt
  const { ref: pendingRef, inView: pendingInView } = useInView({
    threshold: 0,
  });

  // Hook để theo dõi cuộn cho bài viết bị từ chối
  const { ref: rejectedRef, inView: rejectedInView } = useInView({
    threshold: 0,
  });

  // Lấy bài viết đang kiểm duyệt (pending)
  const {
    posts: pendingPosts,
    isLoading: isPendingPostsLoading,
    fetchNextPage: fetchNextPendingPage,
    hasNextPage: hasNextPendingPage,
    isFetchingNextPage: isFetchingNextPendingPage,
  } = usePosts({
    status: "pending",
  });

  // Lấy bài viết bị từ chối (rejected)
  const {
    posts: rejectedPosts,
    isLoading: isRejectedPostsLoading,
    fetchNextPage: fetchNextRejectedPage,
    hasNextPage: hasNextRejectedPage,
    isFetchingNextPage: isFetchingNextRejectedPage,
  } = usePosts({
    status: "rejected",
  });

  // Tải thêm bài viết khi cuộn đến cuối (pending)
  React.useEffect(() => {
    if (pendingInView && hasNextPendingPage && !isFetchingNextPendingPage) {
      fetchNextPendingPage();
    }
  }, [
    pendingInView,
    hasNextPendingPage,
    isFetchingNextPendingPage,
    fetchNextPendingPage,
  ]);

  // Tải thêm bài viết khi cuộn đến cuối (rejected)
  React.useEffect(() => {
    if (rejectedInView && hasNextRejectedPage && !isFetchingNextRejectedPage) {
      fetchNextRejectedPage();
    }
  }, [
    rejectedInView,
    hasNextRejectedPage,
    isFetchingNextRejectedPage,
    fetchNextRejectedPage,
  ]);

  // Hiển thị khi đang tải
  if (isPendingPostsLoading || isRejectedPostsLoading) {
    return (
      <Row justify="center" gutter={[16, 16]}>
        <Col span={16} style={{ padding: "0px 24px" }}>
          <Title level={2} style={{ color: "#1D267D" }}>
            Bài viết đang kiểm duyệt
          </Title>
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Title level={2} style={{ color: "#1D267D" }}>
            Bài viết bị từ chối
          </Title>
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col span={16} style={{ padding: "0px 24px" }}>
        {/* Phần bài viết đang kiểm duyệt */}
        <Title level={2} style={{ color: "#1D267D" }}>
          Bài viết đang kiểm duyệt
        </Title>
        <Divider />
        <PostList posts={pendingPosts} isLoading={isPendingPostsLoading} />
        <div ref={pendingRef} style={{ height: 20, textAlign: "center" }}>
          {isFetchingNextPendingPage && <Spin />}
          {!hasNextPendingPage && pendingPosts.length > 0 && (
            <Typography.Text type="secondary">
              Không còn bài viết để tải
            </Typography.Text>
          )}
          {!hasNextPendingPage && pendingPosts.length === 0 && (
            <Typography.Text type="secondary">
              Không có bài viết đang kiểm duyệt
            </Typography.Text>
          )}
        </div>

        {/* Phần bài viết bị từ chối */}
        <Divider style={{ margin: "40px 0" }} />
        <Title level={2} style={{ color: "#1D267D" }}>
          Bài viết bị từ chối
        </Title>
        <Divider />
        <PostList posts={rejectedPosts} isLoading={isRejectedPostsLoading} />
        <div ref={rejectedRef} style={{ height: 20, textAlign: "center" }}>
          {isFetchingNextRejectedPage && <Spin />}
          {!hasNextRejectedPage && rejectedPosts.length > 0 && (
            <Typography.Text type="secondary">
              Không còn bài viết để tải
            </Typography.Text>
          )}
          {!hasNextRejectedPage && rejectedPosts.length === 0 && (
            <Typography.Text type="secondary">
              Không có bài viết bị từ chối
            </Typography.Text>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default PostPendingPage;
