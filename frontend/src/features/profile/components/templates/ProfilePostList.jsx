import React from "react";
import { posts } from "../../../../mockups/mockup";
import PostList from "../../../home/components/templates/PostList";
const ProfilePostList = () => {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export default ProfilePostList;
