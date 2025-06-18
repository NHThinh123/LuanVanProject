import { Card, Flex, List, Typography } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";

const SuggestedPost = ({ post }) => (
  <List.Item>
    <Card
      cover={
        <img
          alt={post.title}
          src={post.image}
          style={{ maxHeight: 210, objectFit: "cover", overflow: "hidden" }}
        />
      }
      style={{ width: "100%" }}
    >
      <AvatarCustom
        src={post.author.avatar}
        name={post.author.name}
        size={24}
        style={{ fontSize: 14 }}
        color="#000"
      />
      <Card.Meta
        title={post.title}
        description={
          <Flex vertical gap={8}>
            <p
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: 50,
              }}
            >
              {post.content}
            </p>
            <Flex align="center" gap={16}>
              <span>
                <LikeOutlined /> {post.likeCounts}
              </span>
              <span>
                <CommentOutlined /> {post.commentCounts}
              </span>
              <span>{post.date}</span>
            </Flex>
          </Flex>
        }
      />
    </Card>
  </List.Item>
);
export default SuggestedPost;
