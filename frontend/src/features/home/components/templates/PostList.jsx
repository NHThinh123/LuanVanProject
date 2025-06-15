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
} from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const { Text } = Typography;

const PostList = ({ posts }) => {
  return (
    <List
      itemLayout="vertical"
      dataSource={posts}
      renderItem={(item) => (
        <List.Item
          key={item.id}
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
              <LikeOutlined /> {item.likes}
            </span>,
            <span>
              <CommentOutlined /> {item.comments}
            </span>,
            <span>{item.date}</span>,
          ]}
          extra={
            <img
              src={item.image}
              alt={item.title}
              style={{ maxWidth: 250, height: "auto", objectFit: "cover" }}
            />
          }
        >
          <AvatarCustom
            src={item.author.avatar}
            name={item.author.name}
            size={36}
            color={"#000"}
          ></AvatarCustom>

          <List.Item.Meta
            title={<a href="#">{item.title}</a>}
            description={
              <Text
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.content}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default PostList;
