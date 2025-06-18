import { Col, Divider, Flex, Row, Typography } from "antd";
import React from "react";
import { user } from "../../../../mockups/mockup";

const ProfileAbout = () => {
  return (
    <Row>
      <Col span={24}>
        <p>{user.bio ? user.bio : "This user has not provided a bio yet."}</p>
        <Divider />
        <p>Là thành viên học tập của Knowee từ {user.joinDate} </p>
        <Divider />
        <Flex align="center" gap={16} style={{ marginTop: 8 }}>
          <a>{user.followers} người theo dõi</a>
          <a>{user.following} người đang theo dõi</a>
        </Flex>
      </Col>
    </Row>
  );
};

export default ProfileAbout;
