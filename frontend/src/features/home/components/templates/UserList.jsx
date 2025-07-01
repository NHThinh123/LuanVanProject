import { Avatar, Button, Divider, Flex, List, Skeleton } from "antd";
import Title from "antd/es/skeleton/Title";
import React from "react";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const UserList = ({ users, loading }) => {
  if (loading)
    return (
      <>
        <Skeleton active paragraph={{ rows: 2 }} />
        <Divider />
        <Skeleton active paragraph={{ rows: 2 }} />
      </>
    );
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
