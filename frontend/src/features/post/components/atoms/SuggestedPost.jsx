import { Card, Flex, List, Typography } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { formatDate } from "../../../../constants/formatDate";
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
        src={post.user_id.avatar_url}
        name={post.user_id.full_name}
        size={24}
        style={{ fontSize: 14 }}
        color="#000"
      />
      <Card.Meta
        title={post.title}
        description={
          <Flex vertical gap={8}>
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{ __html: post?.content || "" }}
            />
            <Flex align="center" gap={16}>
              <span>
                <LikeOutlined /> {post.likeCount}
              </span>
              <span>
                <CommentOutlined /> {post.commentCount}
              </span>
              <span>{formatDate(post.createdAt)}</span>
            </Flex>
          </Flex>
        }
      />
    </Card>
  </List.Item>
);
export default SuggestedPost;
