import { Col, Divider, Flex, Row, Typography } from "antd";

import { useAuthContext } from "../../../../contexts/auth.context";
import "quill/dist/quill.snow.css";
const ProfileAbout = ({ followers, following }) => {
  const { user, isLoading: authLoading } = useAuthContext();
  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Row>
      <Col span={24}>
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: user.bio || "" }}
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
