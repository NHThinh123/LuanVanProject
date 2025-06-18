import { Avatar, Button, Col, Popover, Row } from "antd";

const AvatarCustom = ({
  style,
  src,
  children,
  size,
  name,
  color,
  follower = 200,
}) => {
  return (
    <Popover
      content={
        <Row
          gutter={16}
          align={"middle"}
          justify={"center"}
          style={{ width: 280 }}
        >
          <Col span={12}>
            <Avatar src={src} shape="circle" size={size || 64} />
            <p style={{ fontWeight: "bold" }}>{name}</p>
            <p> {follower} người theo dõi</p>
          </Col>
          <Col span={12}>
            <Button block style={{ marginBottom: 8 }}>
              Theo dõi
            </Button>
            <Button variant="solid" color="primary" block>
              Nhắn tin
            </Button>
          </Col>
        </Row>
      }
      trigger={"hover"}
    >
      <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          color: color || "#8c8c8c",
          ...style,
        }}
      >
        <Avatar src={src} shape="circle" size={size || 36} />

        <p style={{ margin: 0 }}>{name}</p>
        {children}
      </div>
    </Popover>
  );
};

export default AvatarCustom;
