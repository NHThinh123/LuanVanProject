import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Typography,
  Tabs,
  Skeleton,
} from "antd";
import ProfilePostList from "../features/profile/components/templates/ProfilePostList";
import ProfileAbout from "../features/profile/components/templates/ProfileAbout";
import UserList from "../features/home/components/templates/UserList";
import { usePosts } from "../features/post/hooks/usePost";
import { useUsers } from "../features/user/hooks/useUsers";
import { useParams, useNavigate } from "react-router-dom";
import { useUserById } from "../features/user/hooks/useUserById";
import { useAuthContext } from "../contexts/auth.context";
import { useChatRoom } from "../features/chat/hooks/useChatRoom";
import { Search } from "lucide-react";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";

const UserProfilePage = () => {
  const { id: user_id } = useParams();
  const { user: current_user, isLoading: authLoading } = useAuthContext();
  const { user, isLoading: userLoading } = useUserById(user_id);
  const { posts, isLoading: isPostsLoading } = usePosts({
    status: "accepted",
    user_id: user_id,
  });
  const {
    followers,
    following,
    isLoading: isUserLoading,
  } = useUsers({}, user_id);
  const { follow, unfollow, isFollowLoading } = useUsers();
  const { chatRooms, createChatRoom, createChatRoomLoading } = useChatRoom(
    1,
    10
  );
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");

  // Reset activeTab to "1" when user_id changes
  useEffect(() => {
    setActiveTab("1");
  }, [user_id]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleMessageClick = async () => {
    if (!current_user?._id || !user_id || current_user._id === user_id) return;

    try {
      // Tìm phòng chat private hiện có
      const existingRoom = chatRooms.find(
        (room) =>
          room.type === "private" &&
          room.members.some((member) => member._id === current_user._id) &&
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

  const tabItems = [
    {
      key: "1",
      label: "Bài viết",
      children: <ProfilePostList posts={posts} />,
    },
    {
      key: "2",
      label: "Giới thiệu",
      children: (
        <ProfileAbout
          followers={followers?.length}
          following={following?.length}
          user={user}
        />
      ),
    },
    {
      key: "3",
      label: "Người theo dõi",
      children: <SearchingUserList users={followers} />,
    },
    {
      key: "4",
      label: "Đang theo dõi",
      children: <SearchingUserList users={following} />,
    },
  ];

  if (
    authLoading ||
    isPostsLoading ||
    isUserLoading ||
    userLoading ||
    isFollowLoading
  ) {
    return (
      <Row style={{ height: "100vh" }} justify="center" gutter={[24, 24]}>
        <Col span={16} style={{ marginTop: 20 }}>
          <Skeleton
            active
            avatar={{ size: 156, shape: "circle" }}
            paragraph={{ rows: 2 }}
          />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
        <Col span={6} style={{ padding: "0px 16px" }}>
          <Skeleton active paragraph={{ rows: 3 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 3 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" gutter={[24, 24]}>
      <Col span={16}>
        <Flex align="center" flex={1} gap={16}>
          <Avatar
            src={user?.avatar_url}
            size={156}
            style={{ display: "block", margin: "0 auto", marginTop: 20 }}
          />
          <Flex vertical flex={1}>
            <Flex align="center" justify="space-between">
              <div>
                <h1 style={{ textAlign: "center", marginTop: 20 }}>
                  {user?.full_name}
                </h1>
                <Typography.Text type="secondary" style={{ fontSize: 18 }}>
                  {followers?.length || 0} người theo dõi
                </Typography.Text>
              </div>
              <Flex align="center" gap={8}>
                {current_user?._id ? (
                  user_id !== current_user._id ? (
                    <>
                      <Button
                        variant="outlined"
                        color={user.isFollowing ? "default" : "primary"}
                        onClick={() =>
                          user.isFollowing
                            ? unfollow({ user_follow_id: user._id })
                            : follow({ user_follow_id: user._id })
                        }
                        disabled={isFollowLoading}
                      >
                        {user.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                      </Button>
                      <Button
                        variant="solid"
                        color="primary"
                        onClick={handleMessageClick}
                        loading={createChatRoomLoading}
                      >
                        Nhắn tin
                      </Button>
                    </>
                  ) : (
                    <Button variant="outlined" href="/profile">
                      Trang cá nhân
                    </Button>
                  )
                ) : (
                  <Button variant="outlined" href="/login">
                    Đăng nhập để tương tác
                  </Button>
                )}
              </Flex>
            </Flex>
            <p style={{ marginTop: 16, width: "100%" }}>{user?.bio}</p>
          </Flex>
        </Flex>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          style={{ marginTop: 16 }}
        />
      </Col>
      <Col span={6}>
        <div style={{ position: "sticky", top: 80, padding: "0px 16px" }}>
          <div>
            <Typography.Title level={4} style={{ color: "#1D267D" }}>
              Người theo dõi
            </Typography.Title>
            <UserList users={followers?.slice(0, 3)} loading={isUserLoading} />
            {followers?.length > 3 && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => handleTabChange("3")}
              >
                Xem thêm
              </p>
            )}
          </div>
          <Divider />
          <div>
            <Typography.Title level={4} style={{ color: "#1D267D" }}>
              Đang theo dõi
            </Typography.Title>
            <UserList users={following?.slice(0, 3)} loading={isUserLoading} />
            {following?.length > 3 && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => handleTabChange("4")}
              >
                Xem thêm
              </p>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UserProfilePage;
