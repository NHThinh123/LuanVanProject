/* eslint-disable no-unused-vars */
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
  message,
  Button,
  Drawer,
} from "antd";
import { SendOutlined, MenuOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import { useChatRoom } from "../features/chat/hooks/useChatRoom";
import { useMessages } from "../features/chat/hooks/useMessages";
import { useAuthContext } from "../contexts/auth.context";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";

// Hook để lấy kích thước màn hình
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const { Text, Title } = Typography;

const socket = io("http://localhost:8080", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const MessagePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const { chatRooms, loading, error } = useChatRoom(1, 10);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const messageContainerRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Lấy kích thước màn hình
  const { width } = useWindowSize();
  const isMobile = width < 800;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

  const {
    messages,
    setMessages,
    loading: messagesLoading,
    error: messagesError,
    markMessageAsRead,
    markMessageAsReadLoading,
  } = useMessages(selectedChatRoom?._id, 1, 20);

  // Xử lý chat_room_id từ location.state
  useEffect(() => {
    if (!chatRooms || chatRooms.length === 0 || selectedChatRoom) {
      return;
    }

    const chatRoomIdFromState = location.state?.chat_room_id;
    if (chatRoomIdFromState) {
      const targetRoom = chatRooms.find(
        (room) => room._id === chatRoomIdFromState
      );
      if (targetRoom) {
        setSelectedChatRoom(targetRoom);
        navigate("/messages", { state: {}, replace: true });
      } else {
        setSelectedChatRoom(chatRooms[0]);
      }
    } else {
      setSelectedChatRoom(chatRooms[0]);
    }
  }, [chatRooms, location.state, navigate, selectedChatRoom]);

  // Xử lý Socket.IO
  useEffect(() => {
    if (!selectedChatRoom?._id || !user?._id) return;

    socket.emit("join_room", selectedChatRoom._id);

    const handleReceiveMessage = (newMessage) => {
      console.log("Socket.IO message:", newMessage);
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === newMessage._id)) {
          console.log("Tin nhắn trùng lặp từ Socket.IO:", newMessage._id);
          return prevMessages;
        }
        console.log("Thêm tin nhắn từ Socket.IO:", newMessage._id);
        return [...prevMessages, newMessage];
      });

      queryClient.setQueryData(
        ["messages", selectedChatRoom._id, 1, 20],
        (oldData) => {
          if (!oldData) {
            return {
              messages: [newMessage],
              pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
            };
          }
          if (oldData.messages.some((msg) => msg._id === newMessage._id)) {
            return oldData;
          }
          return {
            ...oldData,
            messages: [...oldData.messages, newMessage],
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
            },
          };
        }
      );
    };

    const handleMessagesRead = ({ chat_room_id, user_id }) => {
      if (chat_room_id === selectedChatRoom._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            !msg.read_by.includes(user_id)
              ? { ...msg, read_by: [...msg.read_by, user_id] }
              : msg
          )
        );
        queryClient.setQueryData(
          ["messages", selectedChatRoom._id, 1, 20],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              messages: oldData.messages.map((msg) =>
                !msg.read_by.includes(user_id)
                  ? { ...msg, read_by: [...msg.read_by, user_id] }
                  : msg
              ),
            };
          }
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_read", handleMessagesRead);
      socket.emit("leave_room", selectedChatRoom._id);
    };
  }, [selectedChatRoom, user, setMessages, queryClient]);

  // Đánh dấu tin nhắn đã đọc
  useEffect(() => {
    if (selectedChatRoom?._id && user?._id) {
      socket.emit("mark_as_read", {
        chat_room_id: selectedChatRoom._id,
        user_id: user._id,
      });
      markMessageAsRead(selectedChatRoom._id).catch((error) => {
        console.error("Lỗi khi đánh dấu đã đọc:", error.message);
      });
    }
  }, [selectedChatRoom, user, markMessageAsRead]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [messages, selectedChatRoom]);

  // Ẩn thanh cuộn toàn trang
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Tự động focus vào input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      socket.emit("send_message", {
        chat_room_id: selectedChatRoom._id,
        content: messageContent,
        user_id: user._id,
      });
      setMessageContent("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      message.error("Lỗi khi gửi tin nhắn: " + error.message);
    }
  };

  const isLastMessageUnread = (chatRoom) => {
    if (!chatRoom?.last_message_id?.read_by || !user?._id) return false;
    return !chatRoom.last_message_id.read_by.some(
      (id) => id.toString() === user._id.toString()
    );
  };

  if (authLoading || loading) {
    return (
      <Row
        style={{ height: "80vh", background: "#f0f2f5" }}
        justify="center"
        align="middle"
      >
        <Spin size={isMobile ? "middle" : "large"} />
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
        <Text
          type="danger"
          style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
        >
          {error}
        </Text>
      </Row>
    );
  }

  if (!user) {
    return (
      <Row justify="center" align={"middle"} style={{ marginTop: 50 }}>
        <Col>
          <Flex align="center" justify="center" vertical gap={16}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
            >
              Vui lòng đăng nhập để có chức năng này
            </Typography.Text>
            <Button type="primary" style={{ marginLeft: 10 }} href="/login">
              Đăng nhập
            </Button>
          </Flex>
        </Col>
      </Row>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <Row
        style={{ height: "80vh", background: "#f0f2f5" }}
        justify="center"
        align="middle"
      >
        <Text style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}>
          Chưa có phòng chat nào
        </Text>
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
      gutter={[0, 0]}
    >
      {!isMobile && (
        <Col
          span={isTablet ? 10 : 8}
          style={{
            borderRight: "1px solid #e8e8e8",
            background: "#fff",
            overflowY: "auto",
            padding: isMobile ? "8px" : isTablet ? "10px" : "10px",
            height: "100%",
          }}
        >
          <Title
            level={isMobile ? 5 : isTablet ? 4 : 3}
            style={{
              padding: isMobile ? "8px 16px" : "10px 20px",
              margin: 0,
              color: "#1D267D",
            }}
          >
            Tin nhắn
          </Title>
          <Divider style={{ margin: isMobile ? "8px 0" : "10px 0" }} />
          <List
            dataSource={chatRooms}
            renderItem={(chatRoom) => {
              const otherMember = getOtherMember(chatRoom);
              const unreadCount = chatRoom.unread_count || 0;
              return (
                <List.Item
                  onClick={() => {
                    setSelectedChatRoom(chatRoom);
                    setDrawerVisible(false);
                  }}
                  style={{
                    padding: isMobile ? "8px 16px" : "10px 20px",
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
                          size={isMobile ? 40 : isTablet ? 45 : 50}
                        />
                      </Flex>
                    }
                    title={
                      <Text
                        strong
                        style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
                      >
                        {otherMember.full_name}
                      </Text>
                    }
                    description={
                      <Text
                        ellipsis
                        style={{
                          color: "#888",
                          fontWeight: isLastMessageUnread(chatRoom)
                            ? "bold"
                            : "normal",
                          fontSize: isMobile ? 12 : isTablet ? 14 : 16,
                        }}
                      >
                        {chatRoom.last_message_id?.content ||
                          "Chưa có tin nhắn"}
                      </Text>
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#888",
                        fontSize: isMobile ? 10 : isTablet ? 11 : 12,
                      }}
                    >
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
                          fontSize: isMobile ? 8 : isTablet ? 9 : 10,
                        }}
                      />
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
        </Col>
      )}
      <Col
        span={isMobile ? 24 : isTablet ? 14 : 16}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          height: "100%",
          overflow: "hidden",
          padding: isMobile ? "8px" : "10px",
        }}
      >
        <div
          style={{
            padding: isMobile ? "8px 16px" : "10px 20px",
            borderBottom: "1px solid #e8e8e8",
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {isMobile && (
            <Button
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ marginRight: 8 }}
            />
          )}
          {selectedChatRoom && (
            <Avatar
              src={
                getOtherMember(selectedChatRoom).avatar_url ||
                "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg"
              }
              size={isMobile ? 40 : isTablet ? 45 : 50}
            />
          )}
          <Title
            level={isMobile ? 5 : isTablet ? 4 : 3}
            style={{ margin: 0, fontSize: isMobile ? 16 : isTablet ? 18 : 20 }}
          >
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
            padding: isMobile ? "8px 16px" : "20px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 8 : 10,
          }}
        >
          {messagesLoading || markMessageAsReadLoading ? (
            <Spin size={isMobile ? "middle" : "large"} />
          ) : messagesError ? (
            <Text
              type="danger"
              style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
            >
              {messagesError}
            </Text>
          ) : messages.length === 0 ? (
            <Text style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}>
              Chưa có tin nhắn
            </Text>
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
                    size={isMobile ? 24 : isTablet ? 28 : 32}
                    style={{ marginTop: 8 }}
                  />
                )}
                <div
                  style={{
                    maxWidth: isMobile ? "80%" : "60%",
                    padding: isMobile ? "6px 10px" : "8px 12px",
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
                      fontSize: isMobile ? 12 : isTablet ? 14 : 16,
                      color:
                        message.user_send_id._id === user._id ? "#888" : "#888",
                    }}
                  >
                    {message.user_send_id._id !== user._id &&
                      message.user_send_id.full_name}
                  </Text>
                  <Text
                    style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
                  >
                    {message.content}
                  </Text>
                  <div
                    style={{
                      fontSize: isMobile ? 10 : isTablet ? 12 : 14,
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
                    size={isMobile ? 24 : isTablet ? 28 : 32}
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
            ))
          )}
        </div>
        <Flex
          style={{
            padding: isMobile ? "8px 16px" : "10px 20px",
            borderTop: "1px solid #e8e8e8",
            background: "#fafafa",
          }}
        >
          <Input
            ref={inputRef}
            placeholder="Nhập tin nhắn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            style={{
              borderRadius: "20px",
              padding: isMobile ? "6px 12px" : "8px 15px",
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
            }}
            onPressEnter={handleSendMessage}
            size={isMobile ? "middle" : "large"}
          />
          <SendOutlined
            style={{
              marginLeft: "10px",
              cursor: !messageContent.trim() ? "not-allowed" : "pointer",
              color: !messageContent.trim() ? "#d9d9d9" : "#0084ff",
              fontSize: isMobile ? 16 : isTablet ? 18 : 20,
            }}
            onClick={handleSendMessage}
          />
        </Flex>
      </Col>
      {isMobile && (
        <Drawer
          title={<Title level={5}>Tin nhắn</Title>}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={isMobile ? "80%" : "50%"}
          bodyStyle={{ padding: isMobile ? "8px" : "10px" }}
        >
          <List
            dataSource={chatRooms}
            renderItem={(chatRoom) => {
              const otherMember = getOtherMember(chatRoom);
              const unreadCount = chatRoom.unread_count || 0;
              return (
                <List.Item
                  onClick={() => {
                    setSelectedChatRoom(chatRoom);
                    setDrawerVisible(false);
                  }}
                  style={{
                    padding: isMobile ? "8px 16px" : "10px 20px",
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
                          size={isMobile ? 40 : isTablet ? 45 : 50}
                        />
                      </Flex>
                    }
                    title={
                      <Text
                        strong
                        style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
                      >
                        {otherMember.full_name}
                      </Text>
                    }
                    description={
                      <Text
                        ellipsis
                        style={{
                          color: "#888",
                          fontWeight: isLastMessageUnread(chatRoom)
                            ? "bold"
                            : "normal",
                          fontSize: isMobile ? 12 : isTablet ? 14 : 16,
                        }}
                      >
                        {chatRoom.last_message_id?.content ||
                          "Chưa có tin nhắn"}
                      </Text>
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#888",
                        fontSize: isMobile ? 10 : isTablet ? 11 : 12,
                      }}
                    >
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
                          fontSize: isMobile ? 8 : isTablet ? 9 : 10,
                        }}
                      />
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
        </Drawer>
      )}
    </Row>
  );
};

export default MessagePage;
