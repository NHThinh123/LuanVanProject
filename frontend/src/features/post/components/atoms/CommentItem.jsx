import {
  Button,
  Col,
  Flex,
  Input,
  List,
  Row,
  Skeleton,
  Typography,
  notification,
} from "antd";
import { useState } from "react";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { CommentOutlined } from "@ant-design/icons";
import CommentList from "../templates/CommentList";
import { useAuthContext } from "../../../../contexts/auth.context";

import { formatDate } from "../../../../constants/formatDate";
import { useComment } from "../../hooks/useComment";

const CommentItem = ({ comment, post_id }) => {
  const { user } = useAuthContext();
  const {
    createComment,
    deleteComment,
    createCommentMutation,
    isLoading,
    createCommentLoading,
  } = useComment(post_id, comment._id);
  const [showReply, setShowReply] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  // Truy vấn phản hồi chỉ khi showReplyList là true
  const {
    comments: replies,
    isLoading: repliesLoading,
    fetchNextPage,
    hasNextPage,
  } = useComment(post_id, showReplyList ? comment._id : null);

  const handleReply = () => {
    if (!user) {
      notification.error({
        message: "Vui lòng đăng nhập để phản hồi",
      });
      return;
    }
    if (!replyContent.trim()) {
      notification.error({
        message: "Vui lòng nhập nội dung phản hồi",
      });
      return;
    }

    createComment(
      { post_id, content: replyContent, parent_comment_id: comment._id },
      {
        onSuccess: () => {
          setReplyContent("");
          setShowReply(false);
          setShowReplyList(true); // Mở danh sách phản hồi sau khi gửi
        },
      }
    );
  };

  const handleDelete = () => {
    if (!user) {
      notification.error({
        message: "Vui lòng đăng nhập để xóa bình luận",
      });
      return;
    }
    deleteComment(comment._id);
  };

  const handleToggleReplies = () => {
    setShowReplyList(!showReplyList);
  };
  if (isLoading || repliesLoading) {
    return (
      <List.Item>
        <Row style={{ width: "100%" }}>
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Col>
        </Row>
      </List.Item>
    );
  }
  return (
    <List.Item>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <AvatarCustom
            src={comment.user_id.avatar_url}
            name={comment.user_id.full_name}
            size={36}
            style={{ fontSize: 16 }}
            color="#000"
          />
        </Col>
        <Col span={24}>
          <Typography.Paragraph style={{ margin: 0 }}>
            {comment.content}
          </Typography.Paragraph>
          <Flex align="center" gap={8} style={{ marginTop: 8 }}>
            <Flex align="center" gap={8}>
              <Button type="text" onClick={handleToggleReplies}>
                <Typography.Text type="secondary">
                  <CommentOutlined style={{ marginRight: 4 }} />
                  {comment.replyCount || 0} Phản hồi
                </Typography.Text>
              </Button>
            </Flex>
            <Button
              type="text"
              onClick={() => setShowReply(!showReply)}
              style={{ textDecoration: "underline" }}
            >
              Phản hồi
            </Button>
            {/* {user?._id === comment.user_id._id && (
              <Button
                type="text"
                danger
                onClick={handleDelete}
                style={{ textDecoration: "underline" }}
              >
                Xóa
              </Button>
            )} */}
            <Typography.Text type="secondary">
              {formatDate(comment.createdAt)}
            </Typography.Text>
          </Flex>
        </Col>
        {showReply && (
          <Col span={23} style={{ marginTop: 8 }}>
            <Input.TextArea
              placeholder="Nhập phản hồi của bạn"
              rows={2}
              style={{ borderRadius: 10 }}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setShowReply(false);
                  setReplyContent("");
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleReply}
                loading={createCommentMutation.isLoading}
              >
                Gửi
              </Button>
            </Flex>
          </Col>
        )}
        {showReplyList && comment.replyCount > 0 && (
          <div
            style={{
              marginLeft: 12,
              paddingLeft: 12,
              borderLeft: "2px solid #e8e8e8",
            }}
          >
            {repliesLoading ? (
              <Typography.Text>Đang tải phản hồi...</Typography.Text>
            ) : (
              <>
                <CommentList
                  comments={replies}
                  post_id={post_id}
                  isLoading={createCommentLoading}
                />
                {hasNextPage && (
                  <Button
                    variant="outlined"
                    color="primary"
                    block
                    onClick={() => fetchNextPage()}
                    disabled={repliesLoading}
                    style={{ marginTop: 8 }}
                  >
                    Xem thêm phản hồi
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </Row>
    </List.Item>
  );
};

export default CommentItem;
