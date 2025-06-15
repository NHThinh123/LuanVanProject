import { Avatar, Button, Flex, List } from "antd";
import Title from "antd/es/skeleton/Title";
import React from "react";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";

const FeaturedUserList = ({ featuredUser }) => {
  return (
    <div>
      <Title level={4}>Người dùng nổi bật</Title>
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
                  size={40}
                  color={"#000"}
                  style={{ fontWeight: "bold" }}
                />
              </div>
              <Button variant="outlined">Theo dõi</Button>
            </Flex>
          </List.Item>
        )}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default FeaturedUserList;
