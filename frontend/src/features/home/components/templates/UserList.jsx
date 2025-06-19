import { Avatar, Button, Flex, List } from "antd";
import Title from "antd/es/skeleton/Title";
import React from "react";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const UserList = ({ users }) => {
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
                  src={user.avatar}
                  name={user.name}
                  size={40}
                  color={"#000"}
                  // style={{ fontWeight: "bold" }}
                />
              </div>
              <Button variant="outlined" color="primary">
                Theo dõi
              </Button>
            </Flex>
          </List.Item>
        )}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default UserList;
