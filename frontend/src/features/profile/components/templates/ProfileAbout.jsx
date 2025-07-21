import { Col, Divider, Flex, Row, Typography } from "antd";

import "quill/dist/quill.snow.css";
const ProfileAbout = ({ followers, following, user }) => {
  return (
    <Row>
      <Col span={24}>
        {user?.university_id && (
          <Typography.Text>
            <b>Học tại:</b>{" "}
            {user?.university_id?.university_name || "Chưa cập nhật"}
          </Typography.Text>
        )}
        <br />
        {user?.major_id && (
          <Typography.Text>
            <b>Chuyên ngành:</b> {user?.major_id?.major_name || "Chưa cập nhật"}
          </Typography.Text>
        )}
        <br />
        <Typography.Text>
          <b>Giới thiệu:</b>
        </Typography.Text>
        <div
          className="ql-editor"
          style={{ height: "auto", padding: 0 }}
          dangerouslySetInnerHTML={{ __html: user?.bio || "" }}
        ></div>
        <Divider />

        <Flex align="center" gap={16} style={{ marginTop: 8 }}>
          <a
            style={{
              color: "#000",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            {followers || 0} người theo dõi
          </a>
          <a
            style={{
              color: "#000",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            {following || 0} người đang theo dõi
          </a>
        </Flex>
      </Col>
    </Row>
  );
};

export default ProfileAbout;
