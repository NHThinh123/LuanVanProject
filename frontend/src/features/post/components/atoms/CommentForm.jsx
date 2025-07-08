import { Button, Flex, Input } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const CommentForm = ({ author }) => {
  if (!author)
    return (
      <Button href="/login" block>
        Đăng nhập để bình luận
      </Button>
    );
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
      />
      <Flex justify="flex-end" gap={8}>
        <Button variant="outlined" color="primary">
          Hủy
        </Button>
        <Button type="primary">Gửi</Button>
      </Flex>
    </div>
  );
};

export default CommentForm;
