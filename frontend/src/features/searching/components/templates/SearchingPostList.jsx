import React from "react";
import PostList from "../../../home/components/templates/PostList";

const SearchingPostList = ({ posts }) => {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export default SearchingPostList;
