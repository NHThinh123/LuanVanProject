import { List } from "antd";
import React from "react";
import SuggestedPost from "../atoms/SuggestedPost";

const SuggestedPostList = ({ posts }) => {
  return (
    <List
      dataSource={posts}
      grid={{ column: 2, gutter: 24 }}
      renderItem={(post) => <SuggestedPost post={post} />}
    />
  );
};

export default SuggestedPostList;
