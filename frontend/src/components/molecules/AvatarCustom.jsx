import { Avatar, Button, Col, Flex, Popover, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { useUsers } from "../../features/user/hooks/useUsers";
import { useAuthContext } from "../../contexts/auth.context";

const AvatarCustom = ({
  style,
  src,
  children,
  size,
  name,
  color,
  follower,
  bio,
  isHover = true,
  user_id, // Thêm prop user_id
  isFollowing, // Thêm prop isFollowing
}) => {
  const { user } = useAuthContext();
  const { follow, unfollow, isFollowLoading } = useUsers();

  return (
    <Popover
      content={
        <Row gutter={16} align={"middle"} style={{ width: 300 }}>
          <Col span={14}>
            <Flex align="center" gap={16}>
              <Avatar src={src} shape="circle" size={size || 64} />
              <div>
                <p style={{ fontWeight: "bold" }}>{name}</p>
                <p style={{ color: "#8c8c8c" }}>
                  {follower || 0} người theo dõi
                </p>
              </div>
            </Flex>
          </Col>
          <Col span={10}>
            {user?._id !== user_id ? (
              <>
                <Button
                  block
                  style={{ marginBottom: 8 }}
                  variant="outlined"
                  color={isFollowing ? "default" : "primary"}
                  onClick={() =>
                    isFollowing
                      ? unfollow({ user_follow_id: user_id })
                      : follow({ user_follow_id: user_id })
                  }
                  loading={isFollowLoading}
                >
                  {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                </Button>
                <Button variant="solid" color="primary" block>
                  Nhắn tin
                </Button>
              </>
            ) : (
              <Button variant="outlined" href="/profile" block>
                {" "}
                Trang cá nhân{" "}
              </Button>
            )}
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
              to={`/user/${user_id}`}
              style={{ margin: 0, color: "#000", fontWeight: "bold" }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
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
          <Link
            to={`/user/${user_id}`}
            style={{ margin: 0, color: "#000" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            {name}
          </Link>
        )}

        {children}
      </div>
    </Popover>
  );
};

export default AvatarCustom;
