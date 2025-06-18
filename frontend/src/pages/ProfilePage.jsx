import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Typography,
  Tabs,
} from "antd";
import { user, featuredUser } from "../mockups/mockup";
import ProfilePostList from "../features/profile/components/templates/ProfilePostList";
import UserList from "../features/home/components/templates/FeaturedUserList";
import ProfileAbout from "../features/profile/components/templates/ProfileAbout";

const ProfilePage = () => {
  const tabItems = [
    {
      key: "1",
      label: "Bài viết",
      children: <ProfilePostList />,
    },
    {
      key: "2",
      label: "Giới thiệu",
      children: <ProfileAbout />,
    },
  ];

  return (
    <Row style={{ height: "100vh" }} justify="center" gutter={[24, 24]}>
      <Col span={16}>
        <Flex align="center" flex={1} gap={16}>
          <Avatar
            src={user.avatar}
            size={156}
            style={{ display: "block", margin: "0 auto", marginTop: 20 }}
          />
          <Flex vertical flex={1}>
            <Flex align="center" justify="space-between">
              <div>
                <h1 style={{ textAlign: "center", marginTop: 20 }}>
                  {user.name}
                </h1>
                <Typography.Text type="secondary" style={{ fontSize: 18 }}>
                  {user.followers} follower
                </Typography.Text>
              </div>
              <Flex align="center">
                <Button style={{ marginRight: 8 }}>Theo dõi</Button>
                <Button type="primary">Nhắn tin</Button>
              </Flex>
            </Flex>
            <p style={{ marginTop: 16, width: "100%" }}>{user.bio}</p>
          </Flex>
        </Flex>
        <Tabs defaultActiveKey="1" items={tabItems} style={{ marginTop: 16 }} />
      </Col>
      <Col span={6}>
        <div style={{ position: "sticky", top: 80, padding: "0px 16px" }}>
          <div>
            <Typography.Title level={4}>Người theo dõi</Typography.Title>
            <UserList users={featuredUser} />
          </div>
          <Divider />
          <div>
            <Typography.Title level={4}>Đang theo dõi</Typography.Title>
            <UserList users={featuredUser} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProfilePage;
