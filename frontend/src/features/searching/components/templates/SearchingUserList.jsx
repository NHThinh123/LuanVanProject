import { Button, Divider, Flex, List } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { Link } from "react-router-dom";
import { useUsers } from "../../../user/hooks/useUsers";

const SearchingUserList = ({ users }) => {
  const { isFollowLoading } = useUsers();
  if (!users || users.length === 0) {
    return (
      <Flex justify="center" style={{ marginTop: 20 }}>
        <div>Không có người dùng phù hợp</div>
      </Flex>
    );
  }
  return (
    <div>
      <List
        grid={{ column: 1 }}
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <Link to={`/user/${user._id}`}>
              <Flex justify="space-between" align="center">
                <div>
                  <AvatarCustom
                    src={user.avatar_url}
                    name={user.full_name}
                    size={60}
                    color={"#000"}
                    bio={user.bio}
                    isHover={false}
                    style={{ gap: 16 }}
                  />
                </div>
                <Button
                  variant={user.isFollowing ? "outlined" : "solid"}
                  color={"primary"}
                  loading={isFollowLoading}
                >
                  {user.isFollowing ? "Đang theo dõi" : "Theo dõi"}
                </Button>
              </Flex>
            </Link>
            <Divider />
          </List.Item>
        )}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default SearchingUserList;
