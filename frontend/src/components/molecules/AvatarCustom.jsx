import { Avatar, Button, Col, Popover, Row } from "antd";
import { Link } from "react-router-dom";

const AvatarCustom = ({
  style,
  src,
  children,
  size,
  name,
  color,
  follower = 200,
  bio,
  isHover = true,
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
            <p style={{ color: "#8c8c8c" }}> {follower || 0} người theo dõi</p>
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
      trigger={isHover ? "hover" : "click"}
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
        <Avatar
          src={src}
          shape="circle"
          size={size || 36}
          style={{ minWidth: size || 36 }}
        />
        {bio ? (
          <div>
            <Link
              to={`/profile`}
              style={{ margin: 0, color: "#000", fontWeight: "bold" }}
            >
              {name}
            </Link>
            <p
              style={{
                color: "#8c8c8c",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 600,
              }}
            >
              {bio}
            </p>
          </div>
        ) : (
          <Link to={`/profile`} style={{ margin: 0, color: "#000" }}>
            {name}
          </Link>
        )}

        {children}
      </div>
    </Popover>
  );
};

export default AvatarCustom;
