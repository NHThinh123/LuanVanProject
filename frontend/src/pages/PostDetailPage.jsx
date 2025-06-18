import { Button, Col, Divider, Flex, Row, Typography } from "antd";

import AvatarCustom from "../components/molecules/AvatarCustom";
import { postDetail, posts } from "../mockups/mockup";
import ActionButtons from "../features/post/components/atoms/ActionButtons";
import CommentForm from "../features/post/components/atoms/CommentForm";

import CommentList from "../features/post/components/templates/CommentList";
import SuggestedPostList from "../features/post/components/templates/SuggestedPostList";

const PostDetailPage = () => {
  return (
    <Row justify="center">
      <Col style={{ width: "100%", maxWidth: 800 }}>
        {/* Tiêu đề bài viết */}

        <Typography.Title level={1} style={{ fontSize: 36, marginBottom: 20 }}>
          {postDetail.title}
        </Typography.Title>
        <Flex align="center" gap={16}>
          <AvatarCustom
            src={postDetail.author.avatar}
            name={postDetail.author.name}
            size={40}
            style={{ fontSize: 16 }}
            color="#000"
          />
          <Button variant="outlined" color="primary">
            Theo dõi
          </Button>
          <Typography.Text>{postDetail.date}</Typography.Text>
        </Flex>
        <Divider style={{ margin: "16px 0" }} />
        <ActionButtons
          likes={postDetail.likeCounts}
          comments={postDetail.commentCounts}
        />
        <Divider style={{ margin: "16px 0" }} />

        {/* Nội dung bài viết */}

        <div
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "#333",
            marginBottom: 20,
          }}
        >
          <Typography.Paragraph>{postDetail.content}</Typography.Paragraph>
          <img
            src={postDetail.image}
            alt={postDetail.title}
            style={{ width: "100%" }}
          />
        </div>
        <Divider style={{ margin: "16px 0" }} />
        <ActionButtons
          likes={postDetail.likeCounts}
          comments={postDetail.commentCounts}
        />
        <Divider style={{ margin: "16px 0" }} />
        {/* Bình luận */}
        <Typography.Title level={2} style={{ marginBottom: 16 }}>
          Bình luận ({postDetail.commentCounts})
        </Typography.Title>
        <CommentForm author={postDetail.author} />
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
