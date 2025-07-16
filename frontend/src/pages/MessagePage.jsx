import { Avatar, Col, Divider, Input, List, Row, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React from "react";

const { Text, Title } = Typography;

// Mock data based on provided schemas
const mockChatRooms = [
  {
    _id: "1",
    last_message_id: {
      content: "Hey, how's it going?",
      user_send_id: {
        _id: "2",
        full_name: "Jane Doe",
        avatar_url:
          "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg",
      },
      createdAt: "2025-07-16T13:30:00Z",
    },
  },
  {
    _id: "2",
    last_message_id: {
      content: "Let's meet tomorrow!",
      user_send_id: {
        _id: "3",
        full_name: "John Smith",
        avatar_url:
          "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg",
      },
      createdAt: "2025-07-16T12:45:00Z",
    },
  },
];

const mockMessages = [
  {
    _id: "m1",
    user_send_id: {
      _id: "1",
      full_name: "You",
      avatar_url:
        "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg",
    },
    content: "Hi Jane, what's up?",
    createdAt: "2025-07-16T13:00:00Z",
  },
  {
    _id: "m2",
    user_send_id: {
      _id: "2",
      full_name: "Jane Doe",
      avatar_url:
        "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg",
    },
    content: "Hey, how's it going?",
    createdAt: "2025-07-16T13:30:00Z",
  },
];

const MessagePage = () => {
  const [selectedChatRoom, setSelectedChatRoom] = React.useState(
    mockChatRooms[0]
  );

  return (
    <Row style={{ height: "100vh", background: "#f0f2f5" }}>
      {/* Chat List */}
      <Col
        span={8}
        style={{
          borderRight: "1px solid #e8e8e8",
          background: "#fff",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        <Title level={4} style={{ padding: "10px 20px", margin: 0 }}>
          Danh sách hộp thoại
        </Title>
        <Divider style={{ margin: "10px 0" }} />
        <List
          dataSource={mockChatRooms}
          renderItem={(chatRoom) => (
            <List.Item
              onClick={() => setSelectedChatRoom(chatRoom)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                background:
                  selectedChatRoom._id === chatRoom._id
                    ? "#e6f7ff"
                    : "transparent",
                borderRadius: "8px",
                margin: "5px 0",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={chatRoom.last_message_id.user_send_id.avatar_url}
                    size={40}
                  />
                }
                title={
                  <Text strong>
                    {chatRoom.last_message_id.user_send_id.full_name}
                  </Text>
                }
                description={
                  <Text ellipsis style={{ color: "#888" }}>
                    {chatRoom.last_message_id.content}
                  </Text>
                }
              />
              <Text style={{ color: "#888", fontSize: "12px" }}>
                {new Date(
                  chatRoom.last_message_id.createdAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </List.Item>
          )}
        />
      </Col>

      {/* Chat Details */}
      <Col
        span={16}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <div
          style={{
            padding: "10px 20px",
            borderBottom: "1px solid #e8e8e8",
            background: "#fafafa",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {selectedChatRoom.last_message_id.user_send_id.full_name}
          </Title>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {mockMessages.map((message) => (
            <div
              key={message._id}
              style={{
                display: "flex",
                justifyContent:
                  message.user_send_id._id === "1" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "8px 12px",
                  background:
                    message.user_send_id._id === "1" ? "#1890ff" : "#f0f0f0",
                  color: message.user_send_id._id === "1" ? "#fff" : "#000",
                  borderRadius:
                    "12 Specifying the message content and stylingpx",
                  margin: "5px 0",
                }}
              >
                <Text>{message.content}</Text>
                <div
                  style={{
                    fontSize: "10px",
                    color:
                      message.user_send_id._id === "1" ? "#d9efff" : "#888",
                    textAlign: "right",
                  }}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid #e8e8e8",
            background: "#fafafa",
          }}
        >
          <Input
            placeholder="Nhập tin nhắn..."
            suffix={<SendOutlined />}
            style={{ borderRadius: "20px", padding: "8px 15px" }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default MessagePage;
