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

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const { posts, isLoading } = usePosts({
    status: "pending",
    user_id: user?._id,
  });
  const { users, isLoading: isUserLoading } = useUsers({});
  const tabItems = [
    {
      key: "1",
      label: "Bài viết",
      children: <ProfilePostList posts={posts} />,
    },
    {
      key: "2",
      label: "Giới thiệu",
      children: <ProfileAbout />,
    },
  ];

  if (authLoading || isLoading) {
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
    <Row style={{ height: "100vh" }} justify="center" gutter={[24, 24]}>
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
                  {user?.followers || 0} follower
                </Typography.Text>
              </div>
              <Flex align="center">
                <Button style={{ marginRight: 8 }}>Theo dõi</Button>
                <Button type="primary">Nhắn tin</Button>
              </Flex>
            </Flex>
            <p style={{ marginTop: 16, width: "100%" }}>{user?.bio}</p>
          </Flex>
        </Flex>
        <Tabs defaultActiveKey="1" items={tabItems} style={{ marginTop: 16 }} />
      </Col>
      <Col span={6}>
        <div style={{ position: "sticky", top: 80, padding: "0px 16px" }}>
          <div>
            <Typography.Title level={4}>Người theo dõi</Typography.Title>
            <UserList users={users} loading={isUserLoading} />
          </div>
          <Divider />
          <div>
            <Typography.Title level={4}>Đang theo dõi</Typography.Title>
            <UserList users={users} loading={isUserLoading} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProfilePage;
