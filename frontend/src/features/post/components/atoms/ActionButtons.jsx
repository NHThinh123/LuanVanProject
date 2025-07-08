import { CommentOutlined, LikeOutlined, LikeFilled } from "@ant-design/icons";
import { Button, Divider, Flex, Typography } from "antd";
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

  return (
    <Flex align="center" gap={8}>
      <Button
        type="text"
        onClick={onToggleLike}
        loading={isLoading}
        icon={localIsLiked ? <LikeFilled /> : <LikeOutlined />}
      >
        <Typography.Text type={localIsLiked ? "primary" : "secondary"}>
          {localLikeCount}
        </Typography.Text>
      </Button>
      <Divider type="vertical" style={{ height: 16 }} />
      <Button type="text">
        <Typography.Text type="secondary">
          <CommentOutlined style={{ marginRight: 4 }} /> {commentCount}
        </Typography.Text>
      </Button>
    </Flex>
  );
};

export default ActionButtons;
