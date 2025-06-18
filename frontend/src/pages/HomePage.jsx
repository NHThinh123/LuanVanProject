import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Divider,
  Avatar,
  List,
} from "antd";

import PostList from "../features/home/components/templates/PostList";
import PostPopularList from "../features/home/components/templates/PostPopularList";

import { postPopular, topics, posts, featuredUser } from "../mockups/mockup";

import UserList from "../features/home/components/templates/FeaturedUserList";

const { Title } = Typography;
const { TabPane } = Tabs;

const HomePage = () => {
  return (
    <Row gutter={16}>
      <Col span={16} style={{ padding: "0px 24px" }}>
        <Tabs defaultActiveKey="1">
          {topics.map((topic, index) => (
            <TabPane tab={topic} key={index + 1}>
              <PostList posts={posts} />
            </TabPane>
          ))}
        </Tabs>
      </Col>
      <Col
        span={8}
        style={{
          padding: "0px 24px",
          maxWidth: 350,
          borderLeft: "1px solid #f0f0f0",
        }}
      >
        <PostPopularList postPopular={postPopular} />
        <Divider />
        <UserList users={featuredUser} />
      </Col>
    </Row>
  );
};

export default HomePage;
