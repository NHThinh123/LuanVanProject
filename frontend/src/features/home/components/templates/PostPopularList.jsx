import React from "react";
import { Flex, Typography } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const PostPopularList = ({ postPopular }) => {
  return (
    <div>
      {postPopular.map((pick) => (
        <div key={pick.id} style={{ marginBottom: 16 }}>
          <Title level={5}>{pick.title}</Title>
          <Text type="secondary" style={{ display: "block" }}>
            <Flex justify="space-between" align="center">
              <div>
                <AvatarCustom
                  src={pick.author.avatar}
                  name={pick.author.name}
                  size={32}
                />
              </div>
              {pick.date}
            </Flex>
          </Text>
        </div>
      ))}
      <Link
        style={{
          display: "flex",
          justifyContent: "center",
          color: "#000",
          textDecoration: "underline",
        }}
      >
        Xem thêm
      </Link>
    </div>
  );
};

export default PostPopularList;
