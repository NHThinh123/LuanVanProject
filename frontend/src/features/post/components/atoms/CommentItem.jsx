import { Button, Col, Flex, Input, List, Row, Typography } from "antd";
import { useState } from "react";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import ActionButtons from "./ActionButtons";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import CommentList from "../templates/CommentList";
import { postDetail } from "../../../../mockups/mockup";
const CommentItem = ({ comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  return (
    <List.Item>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <AvatarCustom
            src={comment.author.avatar}
            name={comment.author.name}
            size={36}
            style={{ fontSize: 16 }}
            color="#000"
          />
        </Col>
        <Col span={24}>
          <Typography.Paragraph style={{ margin: 0 }}>
            {comment.content}
          </Typography.Paragraph>
          <Flex align="center" gap={8} style={{ marginTop: 8 }}>
            <Flex align="center" gap={8}>
              <Button type="text">
                <Typography.Text type="secondary">
                  <LikeOutlined style={{ marginRight: 4 }} />{" "}
                  {comment.likeCounts}
                </Typography.Text>
              </Button>
              <Button
                type="text"
                onClick={() => setShowReplyList(!showReplyList)}
              >
                <Typography.Text type="secondary">
                  <CommentOutlined style={{ marginRight: 4 }} />{" "}
                  {comment.replyCounts}
                </Typography.Text>
              </Button>
            </Flex>
            <Button
              type="text"
              onClick={() => setShowReply(!showReply)}
              style={{ textDecoration: "underline" }}
            >
              Phản hồi
            </Button>
            <Typography.Text type="secondary">{comment.date}</Typography.Text>
          </Flex>
        </Col>
        {showReply && (
          <Col span={23} style={{ marginTop: 8 }}>
            <Input.TextArea
              placeholder="Nhập phản hồi của bạn"
              rows={2}
              style={{ borderRadius: 10 }}
            />
            <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
              <Button variant="outlined" color="primary">
                Hủy
              </Button>
              <Button type="primary">Gửi</Button>
            </Flex>
          </Col>
        )}
        {showReplyList && (
          <div
            style={{
              marginLeft: 12,
              paddingLeft: 12,
              borderLeft: "2px solid #e8e8e8",
            }}
          >
            <CommentList comments={postDetail.comments} />
          </div>
        )}
      </Row>
    </List.Item>
  );
};

export default CommentItem;
