import { Button, Flex, Input, notification } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

import { useState } from "react";
import { useComment } from "../../hooks/useComment";

const CommentForm = ({ author, post_id }) => {
  const { createComment, isLoading } = useComment(post_id);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) {
      notification.error({
        message: "Vui lòng nhập nội dung bình luận",
      });
      return;
    }

    createComment(
      { post_id, content },
      {
        onSuccess: () => {
          setContent(""); // Xóa nội dung sau khi gửi thành công
        },
      }
    );
  };

  if (!author) {
    return (
      <Button href="/login" block>
        Đăng nhập để bình luận
      </Button>
    );
  }

  return (
    <div>
      <AvatarCustom
        src={author?.avatar_url}
        name={author?.full_name}
        size={36}
        style={{ fontSize: 16 }}
        color="#000"
      />
      <Input.TextArea
        placeholder="Nhập bình luận của bạn"
        rows={2}
        style={{ margin: "8px 0", borderRadius: 10 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Flex justify="flex-end" gap={8}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setContent("")}
        >
          Hủy
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          Gửi
        </Button>
      </Flex>
    </div>
  );
};

export default CommentForm;
