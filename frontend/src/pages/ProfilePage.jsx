import { useState } from "react";
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
import { useAuthContext } from "../contexts/auth.context";
import { usePosts } from "../features/post/hooks/usePost";
import { useUsers } from "../features/user/hooks/useUsers";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const { posts, isLoading: isPostsLoading } = usePosts({
    status: "accepted",
    user_id: user?._id,
  });
  const {
    followers,
    following,
    isLoading: isUserLoading,
  } = useUsers({}, user?._id);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
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

  if (authLoading || isPostsLoading || isUserLoading) {
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
  if (!user) {
    return (
      <Row justify="center" align={"middle"} style={{ marginTop: 50 }}>
        <Col>
          <Flex align="center" justify="center" vertical gap={16}>
            <Typography.Text type="secondary">
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
            <Typography.Title level={4}>Người theo dõi</Typography.Title>
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
            <Typography.Title level={4}>Đang theo dõi</Typography.Title>
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

export default ProfilePage;
