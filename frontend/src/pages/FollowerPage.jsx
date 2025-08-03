import React, { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { useUsers } from "../features/user/hooks/useUsers";
import {
  Col,
  Divider,
  Row,
  Skeleton,
  Typography,
  Input,
  Flex,
  Button,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";

// Hook để lấy kích thước màn hình
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const FollowerPage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const user_id = user?._id;
  const {
    followers,
    following,
    isLoading: isUserLoading,
  } = useUsers({}, user_id);
  const [followerSearch, setFollowerSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");

  // Lấy kích thước màn hình
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

  // Hàm chuẩn hóa chuỗi để tìm kiếm không phân biệt dấu
  const normalizeString = (str) => {
    return str
      ?.toLowerCase()
      ?.normalize("NFD")
      ?.replace(/[\u0300-\u036f]/g, "");
  };

  // Lọc danh sách người theo dõi
  const filteredFollowers = followers?.filter((user) =>
    normalizeString(user.full_name).includes(normalizeString(followerSearch))
  );

  // Lọc danh sách người đang theo dõi
  const filteredFollowing = following?.filter((user) =>
    normalizeString(user.full_name).includes(normalizeString(followingSearch))
  );

  if (!user_id) {
    return (
      <Row justify="center" align={"middle"} style={{ marginTop: 50 }}>
        <Col>
          <Flex align="center" justify="center" vertical gap={16}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
            >
              Vui lòng đăng nhập để có chức năng này
            </Typography.Text>
            <Button type="primary" style={{ marginLeft: 10 }} href="/login">
              Đăng nhập
            </Button>
          </Flex>
        </Col>
      </Row>
    );
  }

  if (authLoading || isUserLoading) {
    return (
      <Row justify="center" style={{ marginTop: 20 }} gutter={[16, 16]}>
        <Col
          span={isDesktop ? 24 : 16}
          style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
        >
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{ marginTop: 20 }} gutter={[16, 16]}>
      <Col
        span={isDesktop ? 24 : 16}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <Typography.Title
          level={isMobile ? 3 : 2}
          style={{ marginBottom: isMobile ? 12 : 16, color: "#1D267D" }}
        >
          Danh sách người theo dõi
        </Typography.Title>
        <Input
          placeholder="Tìm kiếm người theo dõi"
          prefix={<SearchOutlined />}
          value={followerSearch}
          onChange={(e) => setFollowerSearch(e.target.value)}
          size={isMobile ? "middle" : "large"}
          style={{
            marginBottom: isMobile ? 12 : 16,
            fontSize: isMobile ? 14 : isTablet ? 16 : 18,
          }}
        />
        {filteredFollowers && filteredFollowers.length > 0 ? (
          <SearchingUserList users={filteredFollowers} />
        ) : (
          <div
            style={{
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
              color: "#8c8c8c",
            }}
          >
            Không có người theo dõi phù hợp.
          </div>
        )}

        <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />

        <Typography.Title
          level={isMobile ? 3 : 2}
          style={{ marginBottom: isMobile ? 12 : 16, color: "#1D267D" }}
        >
          Danh sách người đang theo dõi
        </Typography.Title>
        <Input
          placeholder="Tìm kiếm người đang theo dõi"
          prefix={<SearchOutlined />}
          value={followingSearch}
          onChange={(e) => setFollowingSearch(e.target.value)}
          size={isMobile ? "middle" : "large"}
          style={{
            marginBottom: isMobile ? 12 : 16,
            fontSize: isMobile ? 14 : isTablet ? 16 : 18,
          }}
        />
        {filteredFollowing && filteredFollowing.length > 0 ? (
          <SearchingUserList users={filteredFollowing} />
        ) : (
          <div
            style={{
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
              color: "#8c8c8c",
            }}
          >
            Không có người dùng nào đang được theo dõi phù hợp.
          </div>
        )}
      </Col>
    </Row>
  );
};

export default FollowerPage;
