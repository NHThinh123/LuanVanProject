import React from "react";
import {
  List,
  Avatar,
  Flex,
  Typography,
  Tooltip,
  Popover,
  Row,
  Col,
  Button,
  Tag,
  Spin,
} from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import "quill/dist/quill.snow.css";
import { formatDate } from "../../../../constants/formatDate";
const { Text } = Typography;

const PostList = ({ posts, isLoading }) => {
  if (isLoading) {
    return <Spin tip="Đang tải bài viết..." />;
  }

  // Đảm bảo posts là mảng
  const validPosts = Array.isArray(posts) ? posts : [];

  return (
    <List
      itemLayout="vertical"
      dataSource={validPosts}
      renderItem={(item) => (
        <List.Item
          key={item._id}
          style={{ marginBottom: 28 }}
          styles={{
            extra: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
          actions={[
            <span>
              <LikeOutlined /> {item.likes || 0}
            </span>,
            <span>
              <CommentOutlined /> {item.comments || 0}
            </span>,
            <span>{formatDate(item?.createdAt)}</span>,
          ]}
          extra={
            item.image && (
              <img
                src={item.image}
                alt={item.title}
                style={{ maxWidth: 250, height: "auto", objectFit: "cover" }}
              />
            )
          }
        >
          <AvatarCustom
            src={item.user_id?.avatar_url || ""}
            name={item.user_id?.full_name || "Unknown"}
            size={36}
            color={"#000"}
          ></AvatarCustom>

          <List.Item.Meta
            style={{ minHeight: 80, margin: 0 }}
            title={
              <a
                href={`/posts/${item?._id}`}
                style={{ textDecoration: "none" }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                {item?.title}
              </a>
            }
            description={
              <div
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: item?.content || "" }}
              />
            }
          />
          <Flex gap="4px 0" wrap style={{ marginTop: 8 }}>
            {item.tags?.map((tag) => (
              <Tag key={tag} color="#222831">
                #{tag}
              </Tag>
            ))}
          </Flex>
        </List.Item>
      )}
    />
  );
};

export default PostList;
