import { Col, Row, Tabs, Typography } from "antd";
import React from "react";
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";
import { featuredUser } from "../mockups/mockup";
import UserList from "../features/home/components/templates/UserList";

const SearchingPage = () => {
  const tabItems = [
    {
      key: "1",
      label: "Bài viết",
      children: <SearchingPostList />,
    },
    {
      key: "2",
      label: "Người dùng",
      children: <SearchingUserList />,
    },
  ];
  return (
    <Row justify="center" style={{ height: "100vh" }}>
      <Col span={16}>
        <h1>Kết quả tìm kiếm cho "a"</h1>
        <Tabs defaultActiveKey="1" items={tabItems} style={{ marginTop: 16 }} />
      </Col>
      <Col span={6}>
        <div style={{ position: "sticky", top: 80, padding: "0px 16px" }}>
          <div>
            <Typography.Title level={4}>
              Người dùng phù hợp với "a"
            </Typography.Title>
            <UserList users={featuredUser} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SearchingPage;
