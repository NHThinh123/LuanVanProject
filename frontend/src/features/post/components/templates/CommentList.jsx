import { List, Skeleton } from "antd";
import CommentItem from "../atoms/CommentItem";

const CommentList = ({ comments, post_id }) => {
  return (
    <List
      dataSource={comments}
      grid={{ column: 1 }}
      renderItem={(comment) => (
        <CommentItem comment={comment} post_id={post_id} />
      )}
      style={{ marginTop: 16 }}
    />
  );
};

export default CommentList;
