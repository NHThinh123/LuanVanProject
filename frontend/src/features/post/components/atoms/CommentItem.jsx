import {
  Button,
  Col,
  Divider,
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
import {
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  LikeOutlined,
} from "@ant-design/icons";
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
    likeComment,
    unlikeComment,
  } = useComment(post_id, comment._id);
  const [showReply, setShowReply] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount || 0); // State để cập nhật giao diện likeCount
  const [localIsLiked, setLocalIsLiked] = useState(comment.isLiked); // State để cập nhật giao diện isLiked

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
          setShowReplyList(true);
        },
      }
    );
  };

  // eslint-disable-next-line no-unused-vars
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

  const handleLike = () => {
    if (!user) {
      notification.error({
        message: "Vui lòng đăng nhập để thích bình luận",
      });
      return;
    }

    setLocalIsLiked(!localIsLiked); // Cập nhật giao diện ngay lập tức
    setLocalLikeCount(localIsLiked ? localLikeCount - 1 : localLikeCount + 1); // Cập nhật số lượt like ngay lập tức

    if (localIsLiked) {
      unlikeComment(comment._id, {
        onError: () => {
          setLocalIsLiked(true); // Hoàn nguyên trạng thái nếu lỗi
          setLocalLikeCount(localLikeCount + 1); // Hoàn nguyên số lượt like
          notification.error({
            message: "Bỏ thích bình luận thất bại",
          });
        },
      });
    } else {
      likeComment(comment._id, {
        onError: () => {
          setLocalIsLiked(false); // Hoàn nguyên trạng thái nếu lỗi
          setLocalLikeCount(localLikeCount - 1); // Hoàn nguyên số lượt like
          notification.error({
            message: "Thích bình luận thất bại",
          });
        },
      });
    }
  };

  if (isLoading || repliesLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
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
          <Divider style={{ margin: "8px 0" }} />
          <Flex align="center" gap={8} style={{ marginTop: 8 }}>
            <Flex align="center" gap={8}>
              <Button type="text" onClick={handleLike}>
                <Typography.Text
                  type={localIsLiked ? "primary" : "secondary"}
                  style={{
                    color: localIsLiked ? "#fc3468" : undefined,
                    display: "flex",
                  }}
                >
                  {localIsLiked ? (
                    <HeartFilled style={{ color: "#fc3468" }} />
                  ) : (
                    <HeartOutlined />
                  )}
                  <div style={{ marginLeft: 8 }}>{localLikeCount}</div>
                </Typography.Text>
              </Button>
              <Button type="text" onClick={handleToggleReplies}>
                <Typography.Text type="secondary">
                  <CommentOutlined style={{ marginRight: 4 }} />
                  {showReplyList ? `Ẩn` : `${comment.replyCount || 0}`}
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
                  isLoading={createCommentLoading || repliesLoading}
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
