/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Table, Image, Modal, Button, Tag } from "antd";
import moment from "moment";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { usePosts } from "../features/post/hooks/usePost";
import { usePostActions } from "../features/post/hooks/usePostActions";
import { useQueryClient } from "@tanstack/react-query";

const AdminModerationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const queryClient = useQueryClient();

  // Hooks
  const {
    posts,
    pagination,
    isLoading: isPostsLoading,
    error: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts({ status: "pending" });
  const { updatePostStatusAction, isLoading: isActionLoading } =
    usePostActions(queryClient);

  // Khởi tạo Quill Editor cho modal chi tiết (chỉ đọc)
  useEffect(() => {
    if (isModalVisible && editorRef.current && selectedPost) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        readOnly: true,
        modules: {
          toolbar: false,
        },
      });
      quillRef.current.root.innerHTML = selectedPost.content || "";
      return () => {
        quillRef.current = null;
      };
    }
  }, [isModalVisible, selectedPost]);

  // Xử lý xem chi tiết
  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  // Xử lý duyệt/từ chối bài viết
  const handleApprove = async (postId, status) => {
    try {
      const response = await updatePostStatusAction(postId, status);
      if (response.EC === 0) {
        setIsModalVisible(false);
      }
    } catch (error) {
      // Thông báo lỗi đã được xử lý trong usePostActions.js
    }
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={image}
          alt="Hình ảnh bài viết"
          width={100}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span
          style={{
            cursor: "pointer",
            display: "inline-block",
            maxWidth: "400px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
            fontWeight: "bold",
          }}
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "accepted"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
          style={{ textTransform: "capitalize" }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Lý do từ chối",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => (
        <span
          style={{
            display: "inline-block",
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
          }}
          title={reason || "Không có"}
        >
          {reason || "Không có"}
        </span>
      ),
    },
    {
      title: "Số lượt thích",
      dataIndex: "likeCount",
      key: "likeCount",
    },
    {
      title: "Số lượt bình luận",
      dataIndex: "commentCount",
      key: "commentCount",
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: 8 }}
            disabled={isActionLoading}
          >
            Xem chi tiết
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={() => handleApprove(record._id, "accepted")}
            style={{ marginRight: 8 }}
            disabled={isActionLoading}
          >
            Duyệt
          </Button>
          <Button
            variant="outlined"
            color="red"
            onClick={() => handleApprove(record._id, "rejected")}
            disabled={isActionLoading}
          >
            Từ chối
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý kiểm duyệt bài viết</h2>
      <Table
        columns={columns}
        dataSource={posts}
        loading={isPostsLoading || isFetchingNextPage || isActionLoading}
        pagination={{
          pageSize: pagination.limit || 4,
          total: pagination.total || posts.length,
          current: currentPage,
          showSizeChanger: false,
          onChange: (page) => {
            setCurrentPage(page);
            const pageSize = pagination.limit || 4;
            const requiredPages = Math.ceil((page * pageSize) / pageSize);
            const loadedPages = Math.ceil(posts.length / pageSize);
            if (page > loadedPages && hasNextPage) {
              fetchNextPage();
            }
          },
        }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Chi tiết bài viết"
        open={isModalVisible}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        width={800}
        bodyStyle={{
          maxHeight: "80vh",
          overflow: "auto",
          padding: "16px",
        }}
      >
        {selectedPost && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#f50", // Màu cam cho nhãn
                }}
              >
                Lý do
              </label>
              <div
                style={{
                  margin: "8px 0",
                  padding: "8px",
                  border: "1px solid #f50", // Viền màu cam
                  borderRadius: "4px",
                  backgroundColor: "#fff7e6", // Nền nhẹ để nổi bật
                }}
              >
                {selectedPost.reason || "Không có lý do không duyệt"}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "500", fontSize: "16px" }}>
                Tiêu đề
              </label>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "8px 0",
                  padding: "10px",
                  border: "1px solid #d3d3d3",
                  borderRadius: "4px",
                }}
              >
                {selectedPost.title || "Không có tiêu đề"}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", fontSize: "16px" }}>
                Danh mục
              </label>
              <div
                style={{
                  margin: "8px 0",
                  padding: "10px",
                  border: "1px solid #d3d3d3",
                  borderRadius: "4px",
                }}
              >
                {selectedPost.category_id?.category_name || "Không có danh mục"}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", fontSize: "16px" }}>
                Khóa học
              </label>
              <div
                style={{
                  margin: "8px 0",
                  padding: "10px",
                  border: "1px solid #d3d3d3",
                  borderRadius: "4px",
                }}
              >
                {selectedPost.course_id
                  ? `${selectedPost.course_id.course_code} - ${selectedPost.course_id.course_name}`
                  : "Không có khóa học"}
              </div>
            </div>
            {selectedPost.tags?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontWeight: "600", fontSize: "16px" }}>
                  Thẻ
                </label>
                <div style={{ marginTop: "8px" }}>
                  {selectedPost.tags.map((tag) => (
                    <Tag
                      key={tag._id}
                      color="#222831"
                      style={{ marginRight: "8px" }}
                    >
                      {tag.tag_name}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", fontSize: "16px" }}>
                Nội dung
              </label>
              <div
                ref={editorRef}
                style={{
                  minHeight: "300px",
                  border: "1px solid #d3d3d3",
                  borderRadius: "4px",
                  marginTop: "8px",
                }}
              />
            </div>
            {selectedPost.documents?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontWeight: "600", fontSize: "16px" }}>
                  Ảnh đính kèm
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "8px",
                  }}
                >
                  {selectedPost.documents
                    .filter((doc) => doc.type === "image")
                    .map((doc, index) => (
                      <Image
                        key={index}
                        src={doc.document_url}
                        alt={`Hình ảnh ${index + 1}`}
                        width={100}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                      />
                    ))}
                </div>
              </div>
            )}
            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                onClick={() => handleApprove(selectedPost._id, "accepted")}
                style={{ marginRight: 8 }}
                disabled={isActionLoading}
              >
                Duyệt
              </Button>
              <Button
                danger
                onClick={() => handleApprove(selectedPost._id, "rejected")}
                disabled={isActionLoading}
                style={{ marginRight: 8 }}
              >
                Từ chối
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminModerationPage;
