import { List } from "antd";
import React from "react";
import SuggestedPost from "../atoms/SuggestedPost";

const SuggestedPostList = ({ posts, column = 2, hoverable = false }) => {
  return (
    <List
      dataSource={posts}
      grid={{ column: column, gutter: 24 }}
      renderItem={(post) => <SuggestedPost post={post} hoverable={hoverable} />}
    />
  );
};

export default SuggestedPostList;
