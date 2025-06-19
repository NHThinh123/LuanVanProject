import { Button, Flex, Input } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const CommentForm = ({ author }) => (
  <div>
    <AvatarCustom
      src={author.avatar}
      name={author.name}
      size={36}
      style={{ fontSize: 16 }}
      color="#000"
    />
    <Input.TextArea
      placeholder="Nhập bình luận của bạn"
      rows={2}
      style={{ margin: "8px 0" }}
    />
    <Flex justify="flex-end" gap={8}>
      <Button variant="outlined" color="primary">
        Hủy
      </Button>
      <Button type="primary">Gửi</Button>
    </Flex>
  </div>
);

export default CommentForm;
