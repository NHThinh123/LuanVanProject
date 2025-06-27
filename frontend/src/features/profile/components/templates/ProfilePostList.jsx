import PostList from "../../../home/components/templates/PostList";
const ProfilePostList = ({ posts }) => {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export default ProfilePostList;
