import React from "react";
import PostList from "../../../home/components/templates/PostList";
import { posts } from "../../../../mockups/mockup";

const SearchingPostList = () => {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export default SearchingPostList;
