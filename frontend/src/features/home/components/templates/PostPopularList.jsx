import React from "react";
import { Divider, Flex, Skeleton, Typography } from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../constants/formatDate";

const { Title, Text } = Typography;

const PostPopularList = ({ postPopular, loading }) => {
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
      {postPopular.map((pick) => (
        <div key={pick._id} style={{ marginBottom: 16 }}>
          <Title level={5}>
            <a
              href={`/posts/${pick?._id}`}
              style={{
                textDecoration: "none",
                color: "#000",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {pick?.title}
            </a>
          </Title>
          <Text type="secondary" style={{ display: "block" }}>
            <Flex justify="space-between" align="center">
              <div>
                <AvatarCustom
                  src={pick.user_id?.avatar_url}
                  name={pick.user_id?.full_name}
                  size={32}
                  user_id={pick.user_id?._id}
                  isFollowing={pick.user_id?.isFollowing || false}
                  follower={pick.user_id?.followers_count || 0}
                  fontWeight="normal"
                />
              </div>
              {formatDate(pick.createdAt)}
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
