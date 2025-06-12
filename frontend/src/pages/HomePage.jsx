import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  List,
  Avatar,
  Divider,
  Tabs,
} from "antd";
import { LikeOutlined, CommentOutlined, UserOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const HomePage = () => {
  const topics = [
    "Dành cho bạn",
    "Đang theo dõi",
    "Tân sinh viên",
    "Công nghệ thông tin",
    "Kinh nghiệm học tập",
    "Khác",
  ];
  const articles = [
    {
      id: 1,
      title: "Xcode 26 is here, with Code Intelligence",
      content:
        "How does it stack up against Cursor and AI Agent-based workflow?",
      image: "https://via.placeholder.com/100",
      likes: 309,
      comments: 10,
      date: "2d ago",
      author: "Thomas Ricaurd",
    },
    {
      id: 2,
      title:
        "Why clients pay me 10x more than developers who are better at coding than me",
      content:
        "Last week I charged $15,000 for work a better coder would do for $1,500 and I think you should learn these skills now that we have...",
      image: "https://via.placeholder.com/100",
      likes: 3900,
      comments: 61,
      date: "Jun 2",
      author: "Chris Dunlop",
    },
  ];
  const staffPicks = [
    {
      id: 1,
      title: "Are You Closer to Podcasters Than Your Friends?",
      date: "Jun 4",
      author: "Colin Myers",
    },
    {
      id: 2,
      title:
        "Struggling To Make Up My Mind on the Over-Commercialization of Pride",
      date: "3d ago",
      author: "Giulio Serafini",
    },
    {
      id: 3,
      title:
        "Want to just start writing? Join the 'Write with Medium' June micro-challenge",
      date: "Jun 3",
      author: "Scott Lamb",
    },
  ];

  return (
    <div style={{ padding: "0px 16px" }}>
      <Row gutter={16}>
        <Col span={16}>
          {/* Danh mục chủ đề bằng Tabs */}
          <Tabs defaultActiveKey="1">
            {topics.map((topic, index) => (
              <TabPane tab={topic} key={index + 1}>
                <List
                  itemLayout="vertical"
                  dataSource={articles}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <span>
                          <LikeOutlined /> {item.likes}
                        </span>,
                        <span>
                          <CommentOutlined /> {item.comments}
                        </span>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar src={item.image} shape="square" size={100} />
                        }
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
                      <div>
                        <Text type="secondary">{item.date}</Text> by{" "}
                        {item.author}
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
            ))}
          </Tabs>
        </Col>
        <Col span={8}>
          {/* Staff Picks và User Nổi bật */}
          <div>
            <Title level={4}>Staff Picks</Title>
            {staffPicks.map((pick) => (
              <div key={pick.id} style={{ marginBottom: 16 }}>
                <Text>{pick.title}</Text>
                <Text type="secondary" style={{ display: "block" }}>
                  {pick.date} by {pick.author}
                </Text>
              </div>
            ))}
            <Text type="secondary">See the full list</Text>
          </div>
          <Divider />
          <div>
            <Title level={4}>Popular Topics</Title>
            {["Technology", "Programming", "Data Science"].map(
              (topic, index) => (
                <Text key={index} style={{ marginRight: 8 }}>
                  {topic}
                </Text>
              )
            )}
          </div>
          <Divider />
          <div>
            <Title level={4}>Featured Users</Title>
            <div style={{ marginBottom: 16 }}>
              <Avatar icon={<UserOutlined />} /> Colin Myers
            </div>
            <div>
              <Avatar icon={<UserOutlined />} /> Giulio Serafini
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
