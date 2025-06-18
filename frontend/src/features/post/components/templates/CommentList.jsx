import { List } from "antd";
import CommentItem from "../atoms/CommentItem";

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    grid={{ column: 1 }}
    renderItem={(comment) => <CommentItem comment={comment} />}
    style={{ marginTop: 16 }}
  />
);
export default CommentList;
