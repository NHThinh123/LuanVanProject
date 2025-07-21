import {
  Avatar,
  Col,
  Divider,
  Input,
  List,
  Row,
  Typography,
  Spin,
  Badge,
  Flex,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import { useChatRoom } from "../features/chat/hooks/useChatRoom";
import { useMessages } from "../features/chat/hooks/useMessages";
import { useAuthContext } from "../contexts/auth.context";
import { useLocation, useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const MessagePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const { chatRooms, loading, error } = useChatRoom(1, 10);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [isStateProcessed, setIsStateProcessed] = useState(false); // Theo dõi state đã xử lý
  const messageContainerRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    sendMessageLoading,
    sendMessageError,
    markMessageAsRead,
    markMessageAsReadLoading,
  } = useMessages(selectedChatRoom?._id, 1, 20);

  // Xử lý chat_room_id từ state
  useEffect(() => {
    if (chatRooms.length > 0 && !isStateProcessed) {
      const chatRoomIdFromState = location.state?.chat_room_id;
      if (chatRoomIdFromState) {
        const targetRoom = chatRooms.find(
          (room) => room._id === chatRoomIdFromState
        );
        if (targetRoom) {
          setSelectedChatRoom(targetRoom);
          setIsStateProcessed(true); // Đánh dấu state đã được xử lý
          // Xóa state để tránh tái sử dụng
          navigate("/messages", { state: {}, replace: true });
        }
      } else if (!selectedChatRoom) {
        setSelectedChatRoom(chatRooms[0]);
        setIsStateProcessed(true); // Đánh dấu để không xử lý lại
      }
    }
  }, [chatRooms, location.state, selectedChatRoom, isStateProcessed, navigate]);

  // Cuộn xuống dưới cùng khi tin nhắn hoặc phòng chat thay đổi
  useEffect(() => {
    if (messageContainerRef.current) {
      const scrollToBottom = () => {
        messageContainerRef.current.scrollTo({
          top: messageContainerRef.current.scrollHeight,
          behavior: "instant",
        });
      };
      scrollToBottom();
      const observer = new MutationObserver(scrollToBottom);
      observer.observe(messageContainerRef.current, {
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [messages, selectedChatRoom]);

  // Đánh dấu tin nhắn đã đọc khi chọn phòng chat
  useEffect(() => {
    if (selectedChatRoom?._id && user?._id) {
      markMessageAsRead(selectedChatRoom._id).catch((error) => {
        console.error("Lỗi khi đánh dấu đã đọc:", error.message);
      });
    }
  }, [selectedChatRoom, user, markMessageAsRead]);

  // Vô hiệu hóa cuộn trang
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Focus vào ô input khi component mount hoặc sau khi gửi tin nhắn
  useEffect(() => {
    if (inputRef.current && !sendMessageLoading) {
      inputRef.current.focus();
    }
  }, [sendMessageLoading]);

  const getOtherMember = (chatRoom) => {
    if (!chatRoom?.members || !user?._id)
      return { full_name: "Unknown", avatar_url: "" };
    const otherMember = chatRoom.members.find(
      (member) => member._id !== user._id
    );
    return otherMember || { full_name: "Unknown", avatar_url: "" };
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedChatRoom) return;
    try {
      await sendMessage({
        chat_room_id: selectedChatRoom._id,
        content: messageContent,
      });
      setMessageContent("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error.message);
    }
  };

  const isLastMessageUnread = (chatRoom) => {
    if (!chatRoom?.last_message_id?.read_by || !user?._id) return false;
    return !chatRoom.last_message_id.read_by.some(
      (id) => id.toString() === user._id.toString()
    );
  };
  if (!chatRooms || chatRooms.length === 0) {
    return (
      <Row
        style={{ height: "80vh", background: "#f0f2f5" }}
        justify="center"
        align="middle"
      >
        <Text>Chưa có phòng chat nào</Text>
      </Row>
    );
  }
  if (authLoading || loading) {
    return (
      <Row
        style={{ height: "80vh", background: "#f0f2f5" }}
        justify="center"
        align="middle"
      >
        <Spin size="large" />
      </Row>
    );
  }

  if (error) {
    return (
      <Row
        style={{ height: "80vh", background: "#f0f2f5" }}
        justify="center"
        align="middle"
      >
        <Text type="danger">{error}</Text>
      </Row>
    );
  }

  if (!user) {
    return (
      <Row
        style={{ height: "80vh", background: "#f0f2f5" }}
        justify="center"
        align="middle"
      >
        <Text type="danger">Vui lòng đăng nhập để xem tin nhắn</Text>
      </Row>
    );
  }

  return (
    <Row
      style={{
        height: "80vh",
        background: "#f0f2f5",
        overflow: "hidden",
      }}
    >
      <Col
        span={8}
        style={{
          borderRight: "1px solid #e8e8e8",
          background: "#fff",
          overflowY: "auto",
          padding: "10px",
          height: "100%",
        }}
      >
        <Title level={4} style={{ padding: "10px 20px", margin: 0 }}>
          Tin nhắn
        </Title>
        <Divider style={{ margin: "10px 0" }} />
        <List
          dataSource={chatRooms}
          renderItem={(chatRoom) => {
            const otherMember = getOtherMember(chatRoom);
            const unreadCount = chatRoom.unread_count || 0;
            return (
              <List.Item
                onClick={() => {
                  setSelectedChatRoom(chatRoom);
                  setIsStateProcessed(true); // Đánh dấu để bỏ qua state khi chọn thủ công
                }}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  background:
                    selectedChatRoom?._id === chatRoom._id
                      ? "#e6f7ff"
                      : "transparent",
                  borderRadius: "8px",
                  margin: "5px 0",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Flex
                      flex={1}
                      align="center"
                      gap={8}
                      style={{ marginTop: 8 }}
                    >
                      <Avatar
                        src={
                          otherMember.avatar_url ||
                          "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg"
                        }
                        size={50}
                      />
                    </Flex>
                  }
                  title={<Text strong>{otherMember.full_name}</Text>}
                  description={
                    <Text
                      ellipsis
                      style={{
                        color: "#888",
                        fontWeight: isLastMessageUnread(chatRoom)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {chatRoom.last_message_id?.content || "Chưa có tin nhắn"}
                    </Text>
                  }
                />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Text style={{ color: "#888", fontSize: "12px" }}>
                    {chatRoom.last_message_id?.createdAt
                      ? new Date(
                          chatRoom.last_message_id.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Text>
                  {unreadCount > 0 && (
                    <Badge
                      count={unreadCount}
                      style={{
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        fontSize: "10px",
                      }}
                    />
                  )}
                </div>
              </List.Item>
            );
          }}
        />
      </Col>
      <Col
        span={16}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 20px",
            borderBottom: "1px solid #e8e8e8",
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {selectedChatRoom && (
            <Avatar
              src={
                getOtherMember(selectedChatRoom).avatar_url ||
                "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg"
              }
              size={50}
            />
          )}
          <Title level={4} style={{ margin: 0 }}>
            {selectedChatRoom
              ? getOtherMember(selectedChatRoom).full_name
              : "Chọn một hộp thoại"}
          </Title>
        </div>
        <div
          ref={messageContainerRef}
          className="message-container"
          style={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "thin",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messagesLoading || markMessageAsReadLoading ? (
            <Spin />
          ) : messagesError ? (
            <Text type="danger">{messagesError}</Text>
          ) : (
            messages?.map((message) => (
              <div
                key={message._id}
                style={{
                  display: "flex",
                  justifyContent:
                    message.user_send_id._id === user._id
                      ? "flex-end"
                      : "flex-start",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {message.user_send_id._id !== user._id && (
                  <Avatar
                    src={
                      message.user_send_id.avatar_url ||
                      "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg"
                    }
                    size={32}
                    style={{ marginTop: 8 }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "8px 12px",
                    background:
                      message.user_send_id._id === user._id
                        ? "#d9efff"
                        : "#f0f0f0",
                    color:
                      message.user_send_id._id === user._id ? "#000" : "#000",
                    borderRadius: "12px",
                    margin: "5px 0",
                    wordBreak: "break-word",
                    border:
                      message.user_send_id._id === user._id
                        ? "1px solid #0084ff"
                        : "1px solid #e8e8e8",
                  }}
                >
                  <Text
                    strong
                    style={{
                      textAlign:
                        message.user_send_id._id === user._id
                          ? "right"
                          : "left",
                      display: "block",
                      fontSize: "12px",
                      color:
                        message.user_send_id._id === user._id ? "#888" : "#888",
                    }}
                  >
                    {message.user_send_id._id !== user._id &&
                      message.user_send_id.full_name}
                  </Text>
                  <Text>{message.content}</Text>
                  <div
                    style={{
                      fontSize: "10px",
                      color:
                        message.user_send_id._id === user._id ? "#888" : "#888",
                      textAlign: "right",
                    }}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {message.user_send_id._id === user._id && (
                  <Avatar
                    src={
                      user.avatar_url ||
                      "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg"
                    }
                    size={32}
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
            ))
          )}
        </div>
        {sendMessageError && (
          <Text type="danger" style={{ marginTop: "5px", display: "block" }}>
            {sendMessageError}
          </Text>
        )}
        <Flex
          style={{
            padding: "10px 20px",
            borderTop: "1px solid #e8e8e8",
            background: "#fafafa",
          }}
        >
          <Input
            ref={inputRef}
            placeholder="Nhập tin nhắn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            style={{ borderRadius: "20px", padding: "8px 15px" }}
            onPressEnter={handleSendMessage}
            disabled={sendMessageLoading}
          />
          <SendOutlined
            style={{
              marginLeft: "10px",
              cursor:
                sendMessageLoading || !messageContent.trim()
                  ? "not-allowed"
                  : "pointer",
              color:
                sendMessageLoading || !messageContent.trim()
                  ? "#d9d9d9"
                  : "#0084ff",
            }}
            onClick={handleSendMessage}
          />
        </Flex>
      </Col>
    </Row>
  );
};

export default MessagePage;
