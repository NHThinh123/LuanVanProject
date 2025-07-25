import {
  Avatar,
  Button,
  Divider,
  Flex,
  List,
  Skeleton,
  Typography,
} from "antd";
import React from "react";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { useAuthContext } from "../../../../contexts/auth.context";
import { useUsers } from "../../../user/hooks/useUsers";

const UserList = ({ users, loading }) => {
  const { user: current_user, isLoading: authLoading } = useAuthContext();
  const { follow, unfollow, isFollowLoading } = useUsers();

  if (loading || authLoading) {
    return (
      <>
        <Skeleton active paragraph={{ rows: 2 }} />
        <Divider />
        <Skeleton active paragraph={{ rows: 2 }} />
      </>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Typography.Text style={{ textAlign: "center" }}>
        Chưa có người dùng phù hợp
      </Typography.Text>
    );
  }

  return (
    <div>
      <List
        grid={{ column: 1 }}
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <Flex justify="space-between" align="center">
              <div>
                <AvatarCustom
                  src={user.avatar_url}
                  name={user.full_name}
                  size={40}
                  color={"#000"}
                  follower={user.followers_count}
                  user_id={user._id}
                  isFollowing={user.isFollowing}
                  fontWeight="normal"
                />
              </div>
              {current_user?._id && user._id !== current_user._id && (
                <Button
                  variant={user.isFollowing ? "outlined" : "solid"}
                  color={"primary"}
                  onClick={() =>
                    user.isFollowing
                      ? unfollow({ user_follow_id: user._id })
                      : follow({ user_follow_id: user._id })
                  }
                  loading={isFollowLoading}
                  style={{ width: 120 }}
                >
                  {user.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                </Button>
              )}
              {!current_user?._id && (
                <Button
                  variant="outlined"
                  href="/login"
                  style={{ width: 120 }}
                  title="Đăng nhập để tương tác"
                >
                  Đăng nhập để...
                </Button>
              )}
            </Flex>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UserList;
