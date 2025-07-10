import {
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import AvatarCustom from "../components/molecules/AvatarCustom";
import ActionButtons from "../features/post/components/atoms/ActionButtons";
import CommentForm from "../features/post/components/atoms/CommentForm";
import CommentList from "../features/post/components/templates/CommentList";
import SuggestedPostList from "../features/post/components/templates/SuggestedPostList";
import { usePostById } from "../features/post/hooks/usePostById";

import { useParams } from "react-router-dom";
import { formatDate } from "../constants/formatDate";
import "quill/dist/quill.snow.css";
import { useAuthContext } from "../contexts/auth.context";
import { posts } from "../mockups/mockup";
import { useComment } from "../features/post/hooks/useComment";

const PostDetailPage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const post_id = useParams().id;
  const { post, isLoading: postsLoading } = usePostById(post_id, user?._id);
  const {
    comments,
    // pagination,
    isLoading: commentsLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useComment(post_id);

  if (authLoading || postsLoading || commentsLoading) {
    return (
      <Row justify={"center"}>
        <Col style={{ width: "100%", maxWidth: 800 }}>
          <Skeleton active paragraph={{ rows: 2 }} />
          <Divider style={{ margin: "16px 0" }} />
          <Skeleton
            active
            avatar
            paragraph={{ rows: 2 }}
            style={{ marginBottom: 20 }}
          />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider style={{ margin: "16px 0" }} />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider style={{ margin: "16px 0" }} />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider style={{ margin: "16px 0" }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row justify="center">
        <Col style={{ width: "100%", maxWidth: 800 }}>
          <Typography.Text type="danger">Lỗi: {error.message}</Typography.Text>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center">
      <Col style={{ width: "100%", maxWidth: 800 }}>
        <Typography.Title level={1} style={{ fontSize: 36, marginBottom: 10 }}>
          {post.title || "Tiêu đề bài viết"}
        </Typography.Title>
        <Flex style={{ marginBottom: 16 }} gap={8}>
          <Tag color="blue">{post.course_id?.course_name}</Tag>
          <Tag color="green">{post.category_id?.category_name}</Tag>
        </Flex>

        <Flex align="center" gap={16}>
          <AvatarCustom
            src={post.user_id?.avatar_url}
            name={post.user_id?.full_name}
            size={40}
            style={{ fontSize: 16 }}
            color="#000"
          />
          <Button variant="outlined" color="primary">
            Theo dõi
          </Button>
          <Typography.Text>{formatDate(post.createdAt)}</Typography.Text>
        </Flex>
        <Divider style={{ margin: "16px 0" }} />
        <ActionButtons
          commentCount={post.commentCount}
          isLiked={post.isLiked}
          likeCount={post.likeCount}
          postId={post._id}
        />
        <Divider style={{ margin: "16px 0" }} />
        {post.tags && post.tags.length > 0 && (
          <>
            {post.tags?.map((tag) => (
              <Tag
                style={{ padding: 4, fontSize: 14 }}
                key={tag}
                color="#222831"
              >
                #{tag}
              </Tag>
            ))}
            <Divider style={{ margin: "16px 0" }} />
          </>
        )}

        <div
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
          />
        </div>
        <Divider style={{ margin: "16px 0" }} />
        <ActionButtons
          commentCount={post.commentCount}
          isLiked={post.isLiked}
          likeCount={post.likeCount}
          postId={post._id}
        />
        <Divider style={{ margin: "16px 0" }} />
        <Typography.Title level={2} style={{ marginBottom: 16 }}>
          Bình luận ({post.commentCount})
        </Typography.Title>
        <CommentForm author={user} post_id={post_id} />
        <Divider />
        <CommentList comments={comments} post_id={post_id} />
        <Divider />
        {hasNextPage && (
          <Button
            variant="outlined"
            color="primary"
            block
            onClick={() => fetchNextPage()}
            disabled={commentsLoading}
          >
            Xem thêm bình luận
          </Button>
        )}
        <Divider />
        <Typography.Title level={1} style={{ margin: "16px 0" }}>
          Bài viết đề xuất
        </Typography.Title>
        <SuggestedPostList posts={posts} />
      </Col>
    </Row>
  );
};

export default PostDetailPage;
