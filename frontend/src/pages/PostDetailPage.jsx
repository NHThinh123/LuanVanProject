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

import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../constants/formatDate";
import "quill/dist/quill.snow.css";
import { useAuthContext } from "../contexts/auth.context";

import { useComment } from "../features/post/hooks/useComment";
import { usePosts } from "../features/post/hooks/usePost";

const PostDetailPage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const post_id = useParams().id;

  const { post, isLoading: postsLoading } = usePostById(post_id, user?._id);
  const { posts, isLoading: isPostsLoading } = usePosts({ status: "accepted" });
  const {
    comments,
    // pagination,
    isLoading: commentsLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useComment(post_id);
  const navigate = useNavigate();
  if (authLoading || postsLoading || commentsLoading || isPostsLoading) {
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
            user_id={post.user_id?._id}
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
                key={tag._id}
                color="#222831"
                onClick={() => navigate(`/posts/tag/${tag._id}`)}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                #{tag.tag_name}
              </Tag>
            ))}
            <Divider style={{ margin: "16px 0" }} />
          </>
        )}
        {post.summary && (
          <div
            style={{
              border: "1px solid #0616f6ff",
              backgroundColor: "#f0f5ff",
              margin: "8px",
              padding: 16,
              borderRadius: 24,
              fontStyle: "italic",
              textAlign: "justify",
            }}
          >
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
              Tóm tắt bài viết tự động
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
              {post.summary || "Bài viết này chưa có tóm tắt."}
            </Typography.Paragraph>
          </div>
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
