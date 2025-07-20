import {
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Divider, Flex, Typography, message } from "antd";
import { useState, useEffect } from "react";
import useLikePostAction from "../../hooks/useLikePostAction";

const ActionButtons = ({ postId, likeCount, isLiked, commentCount }) => {
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const { handleToggleLike, isLoading } = useLikePostAction(
    postId,
    localIsLiked
  );

  // Đồng bộ local state với props khi props thay đổi
  useEffect(() => {
    setLocalLikeCount(likeCount);
    setLocalIsLiked(isLiked);
  }, [likeCount, isLiked]);

  // Hàm xử lý toggle like với cập nhật cục bộ
  const onToggleLike = () => {
    if (!localStorage.getItem("access_token")) {
      // Thông báo lỗi được xử lý trong useLikePostAction
      handleToggleLike();
      return;
    }

    // Cập nhật cục bộ trước khi gọi API
    setLocalIsLiked(!localIsLiked);
    setLocalLikeCount((prev) => (localIsLiked ? prev - 1 : prev + 1));

    // Gọi API để xác nhận hành động
    handleToggleLike();
  };

  // Hàm xử lý chia sẻ
  const onShare = () => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    const shareData = {
      title: "Chia sẻ bài viết",
      url: postUrl,
    };

    // Kiểm tra nếu Web Share API được hỗ trợ
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          console.log("Đã mở hệ thống chia sẻ!");
        })
        .catch((error) => {
          console.error("Lỗi khi chia sẻ:", error);
          // Fallback: Sao chép liên kết vào clipboard
          navigator.clipboard
            .writeText(postUrl)
            .then(() => {
              message.success("Liên kết bài viết đã được sao chép!");
            })
            .catch(() => {
              message.error("Không thể sao chép liên kết!");
            });
        });
    } else {
      // Fallback: Sao chép liên kết vào clipboard
      navigator.clipboard
        .writeText(postUrl)
        .then(() => {
          message.success("Liên kết bài viết đã được sao chép!");
        })
        .catch(() => {
          message.error("Không thể sao chép liên kết!");
        });
    }
  };

  return (
    <Flex align="center" gap={8}>
      <Button
        type="text"
        onClick={onToggleLike}
        loading={isLoading}
        icon={
          localIsLiked ? (
            <HeartFilled style={{ color: "#fc3468" }} />
          ) : (
            <HeartOutlined />
          )
        }
      >
        <Typography.Text
          type={localIsLiked ? "primary" : "secondary"}
          style={{ color: localIsLiked ? "#fc3468" : "inherit" }}
        >
          {localLikeCount}
        </Typography.Text>
      </Button>
      <Divider type="vertical" style={{ height: 16 }} />
      <Button type="text">
        <Typography.Text>
          <CommentOutlined style={{ marginRight: 4 }} /> {commentCount}
        </Typography.Text>
      </Button>
      <Divider type="vertical" style={{ height: 16 }} />
      <Button type="text" onClick={onShare}>
        <Typography.Text>
          <ShareAltOutlined style={{ marginRight: 4 }} /> Chia sẻ
        </Typography.Text>
      </Button>
    </Flex>
  );
};

export default ActionButtons;
