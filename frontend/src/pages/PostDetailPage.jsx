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
import { postDetail, posts } from "../mockups/mockup";
import ActionButtons from "../features/post/components/atoms/ActionButtons";
import CommentForm from "../features/post/components/atoms/CommentForm";

import CommentList from "../features/post/components/templates/CommentList";
import SuggestedPostList from "../features/post/components/templates/SuggestedPostList";
import { usePostById } from "../features/post/hooks/usePostById";
import { useParams } from "react-router-dom";
import { formatDate } from "../constants/formatDate";
import "quill/dist/quill.snow.css";
import { useAuthContext } from "../contexts/auth.context";
const PostDetailPage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const post_id = useParams().id;
  const { post, isLoading: postsLoading } = usePostById(post_id);

  if (authLoading || postsLoading) {
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
  return (
    <Row justify="center">
      <Col style={{ width: "100%", maxWidth: 800 }}>
        {/* Tiêu đề bài viết */}

        <Typography.Title level={1} style={{ fontSize: 36, marginBottom: 20 }}>
          {post.title || "Tiêu đề bài viết"}
        </Typography.Title>

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
        <ActionButtons likes={post.likeCount} comments={post.commentCount} />
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

        {/* Nội dung bài viết */}

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
        <ActionButtons likes={post.likeCount} comments={post.commentCount} />
        <Divider style={{ margin: "16px 0" }} />
        {/* Bình luận */}
        <Typography.Title level={2} style={{ marginBottom: 16 }}>
          Bình luận ({post.commentCount})
        </Typography.Title>
        <CommentForm author={user} />
        <Divider />

        <CommentList comments={postDetail.comments} />
        <Divider />

        <Button variant="outlined" color="primary" block>
          Xem thêm bình luận
        </Button>
        <Divider />
        {/* Bài viết đề xuất */}

        <Typography.Title level={1} style={{ margin: "16px 0" }}>
          Bài viết đề xuất
        </Typography.Title>
        <SuggestedPostList posts={posts} />
      </Col>
    </Row>
  );
};

export default PostDetailPage;
