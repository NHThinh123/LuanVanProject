import React, { useState } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { useUsers } from "../features/user/hooks/useUsers";
import { Col, Divider, Row, Skeleton, Typography, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SearchingUserList from "../features/searching/components/templates/SearchingUserList";

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
    return <div>Vui lòng đăng nhập để xem trang người theo dõi.</div>;
  }

  if (authLoading || isUserLoading) {
    return (
      <Row justify="center" style={{ marginTop: 20 }}>
        <Col span={16}>
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{ marginTop: 20 }}>
      <Col span={16}>
        <Typography.Title level={2}>Danh sách người theo dõi</Typography.Title>
        <Input
          placeholder="Tìm kiếm người theo dõi"
          prefix={<SearchOutlined />}
          value={followerSearch}
          onChange={(e) => setFollowerSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        {filteredFollowers && filteredFollowers.length > 0 ? (
          <SearchingUserList users={filteredFollowers} />
        ) : (
          <div>Không có người theo dõi phù hợp.</div>
        )}

        <Divider />

        <Typography.Title level={2}>
          Danh sách người đang theo dõi
        </Typography.Title>
        <Input
          placeholder="Tìm kiếm người đang theo dõi"
          prefix={<SearchOutlined />}
          value={followingSearch}
          onChange={(e) => setFollowingSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        {filteredFollowing && filteredFollowing.length > 0 ? (
          <SearchingUserList users={filteredFollowing} />
        ) : (
          <div>Không có người dùng nào đang được theo dõi phù hợp.</div>
        )}
      </Col>
    </Row>
  );
};

export default FollowerPage;
