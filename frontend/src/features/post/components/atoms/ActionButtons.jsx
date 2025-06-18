import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

const ActionButtons = ({ likes, comments }) => {
  return (
    <Flex align="center" gap={8}>
      <Button type="text">
        <Typography.Text type="secondary">
          <LikeOutlined style={{ marginRight: 4 }} /> {likes}
        </Typography.Text>
      </Button>
      <Button type="text">
        <Typography.Text type="secondary">
          <CommentOutlined style={{ marginRight: 4 }} /> {comments}
        </Typography.Text>
      </Button>
    </Flex>
  );
};

export default ActionButtons;
