import { featuredUser } from "../../../../mockups/mockup";
import Title from "antd/es/skeleton/Title";
import { Button, Divider, Flex, List } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const SearchingUserList = () => {
  return (
    <div>
      <List
        grid={{ column: 1 }}
        dataSource={featuredUser}
        renderItem={(user) => (
          <List.Item>
            <Flex justify="space-between" align="center">
              <div>
                <AvatarCustom
                  src={user.avatar}
                  name={user.name}
                  size={60}
                  color={"#000"}
                  bio={user.bio}
                  isHover={false}
                  style={{ gap: 16 }}
                />
              </div>
              <Button variant="outlined" color="primary">
                Theo dõi
              </Button>
            </Flex>
            <Divider />
          </List.Item>
        )}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default SearchingUserList;
