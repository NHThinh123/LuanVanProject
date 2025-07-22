import { Avatar, Button, Col, Flex, Popover, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "../../features/user/hooks/useUsers";
import { useAuthContext } from "../../contexts/auth.context";
import { useChatRoom } from "../../features/chat/hooks/useChatRoom";

const AvatarCustom = ({
  style,
  src,
  children,
  size,
  name,
  color,
  follower,
  bio,
  isHover = true,
  user_id,
  isFollowing,
  fontWeight = "bold",
}) => {
  const { user } = useAuthContext();
  const { follow, unfollow, isFollowLoading } = useUsers();
  const { chatRooms, createChatRoom, createChatRoomLoading } = useChatRoom(
    1,
    10
  );
  const navigate = useNavigate();

  const handleMessageClick = async () => {
    if (!user?._id || !user_id || user._id === user_id) return;

    try {
      // Tìm phòng chat private hiện có
      const existingRoom = chatRooms.find(
        (room) =>
          room.type === "private" &&
          room.members.some((member) => member._id === user._id) &&
          room.members.some((member) => member._id === user_id)
      );

      if (existingRoom) {
        // Nếu phòng chat đã tồn tại, chuyển hướng với chat_room_id
        navigate("/messages", { state: { chat_room_id: existingRoom._id } });
      } else {
        // Tạo phòng chat mới
        const result = await createChatRoom({ member_id: user_id });

        if (result?._id) {
          navigate("/messages", { state: { chat_room_id: result._id } });
        } else {
          console.error("Không thể tạo phòng chat");
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý nhắn tin:", error.message);
    }
  };

  return (
    <Popover
      content={
        <Row
          gutter={16}
          align="middle"
          style={{ width: user?._id ? 300 : 400 }}
        >
          <Col span={user?._id ? 14 : 12}>
            <Flex align="center" gap={16}>
              <Avatar src={src} shape="circle" size={size || 64} />
              <div>
                <p style={{ fontWeight: "bold" }}>{name}</p>
                <p style={{ color: "#8c8c8c" }}>
                  {follower || 0} người theo dõi
                </p>
              </div>
            </Flex>
          </Col>
          <Col span={user?._id ? 10 : 12}>
            {user?._id ? (
              user._id !== user_id ? (
                <>
                  <Button
                    block
                    style={{ marginBottom: 8 }}
                    variant="outlined"
                    color={isFollowing ? "default" : "primary"}
                    onClick={() =>
                      isFollowing
                        ? unfollow({ user_follow_id: user_id })
                        : follow({ user_follow_id: user_id })
                    }
                    loading={isFollowLoading}
                  >
                    {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    block
                    onClick={handleMessageClick}
                    loading={createChatRoomLoading}
                  >
                    Nhắn tin
                  </Button>
                </>
              ) : (
                <Button variant="outlined" href="/profile" block>
                  Trang cá nhân
                </Button>
              )
            ) : (
              <Button variant="outlined" href="/login" block>
                Đăng nhập để tương tác
              </Button>
            )}
          </Col>
        </Row>
      }
      trigger={isHover ? "hover" : "click"}
    >
      <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          color: color || "#8c8c8c",
          ...style,
        }}
      >
        <Avatar
          src={src}
          shape="circle"
          size={size || 36}
          style={{ minWidth: size || 36 }}
        />
        {bio ? (
          <div>
            <Link
              to={`/user/${user_id}`}
              style={{ margin: 0, color: "#000", fontWeight: "bold" }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {name}
            </Link>
            <p
              style={{
                color: "#8c8c8c",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 600,
              }}
            >
              {bio}
            </p>
          </div>
        ) : (
          <Link
            to={`/user/${user_id}`}
            style={{ margin: 0, color: "#000", fontWeight: fontWeight }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            {name}
          </Link>
        )}
        {children}
      </div>
    </Popover>
  );
};

export default AvatarCustom;
