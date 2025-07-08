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
  Tag,
  Spin,
} from "antd";

import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import "quill/dist/quill.snow.css";
import { formatDate } from "../../../../constants/formatDate";
import SkeletonLoading from "../../../../components/atoms/SkeletonLoading";
import ActionButtons from "../../../post/components/atoms/ActionButtons";
const { Text } = Typography;

const PostList = ({ posts = [], isLoading }) => {
  if (isLoading) {
    return <SkeletonLoading />;
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={posts}
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
            <ActionButtons
              postId={item._id}
              likeCount={item.likeCount || 0}
              isLiked={item.isLiked || false}
              commentCount={item.commentCount || 0}
            />,
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
