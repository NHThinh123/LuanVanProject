import { List, Skeleton } from "antd";
import CommentItem from "../atoms/CommentItem";

const CommentList = ({ comments, post_id, isLoading }) => {
  if (!comments || comments.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: 16 }}>
        Chưa có bình luận nào.
      </div>
    );
  }
  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }
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
