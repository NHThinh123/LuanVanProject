/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Table, Image, Modal, Form, Input, Button, Select, Tag } from "antd";
import moment from "moment";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { usePosts } from "../features/post/hooks/usePost";
import { usePostActions } from "../features/post/hooks/usePostActions";
import { useQueryClient } from "@tanstack/react-query";
import { useTag } from "../features/tag/hooks/useTag";
import { uploadImageToCloudinary } from "../features/post/services/upload.service";

const AdminPostPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
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
  } = usePosts({});
  const {
    deletePostAction,
    updatePostAction,
    isLoading: isActionLoading,
  } = usePostActions(queryClient);
  const { tags, tagsLoading, createTag } = useTag();

  // Khởi tạo Quill Editor
  useEffect(() => {
    if (isModalVisible && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              ["link", "image"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
            handlers: {
              image: async () => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = async () => {
                  const file = input.files[0];
                  if (file) {
                    const imageUrl = await uploadImageToCloudinary(file);
                    if (imageUrl) {
                      setImageUrls((prev) => [...prev, imageUrl]);
                      const range = quillRef.current.getSelection() || {
                        index: 0,
                      };
                      quillRef.current.insertEmbed(
                        range.index,
                        "image",
                        imageUrl
                      );
                    }
                  }
                };
              },
            },
          },
        },
        placeholder: "Nhập nội dung bài viết tại đây...",
      });

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });

      // Điền nội dung bài viết vào Quill
      if (selectedPost) {
        quillRef.current.root.innerHTML = selectedPost.content || "";
        setContent(selectedPost.content || "");
      }

      return () => {
        quillRef.current = null;
      };
    }
  }, [isModalVisible, selectedPost]);

  // Điền dữ liệu vào form khi mở modal
  useEffect(() => {
    if (selectedPost) {
      form.setFieldsValue({
        title: selectedPost.title || "",
        tags: selectedPost.tags?.map((tag) => tag.tag_name) || [],
      });
      setSelectedTags(selectedPost.tags?.map((tag) => tag.tag_name) || []);
      setImageUrls(
        selectedPost.documents
          ?.filter((doc) => doc.type === "image")
          .map((doc) => doc.document_url) || []
      );
    }
  }, [selectedPost, form]);

  // Tính toán dataSource cho trang hiện tại
  const dataSource = useMemo(() => {
    const pageSize = pagination.limit || 4;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return posts.slice(startIndex, endIndex).map((post) => ({
      key: post._id,
      _id: post._id,
      image: post.image,
      title: post.title,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      status: post.status,
      content: post.content,
      tags: post.tags,
      documents: post.documents,
    }));
  }, [posts, currentPage, pagination.limit]);

  // Tính toán tổng số trang
  const totalPages =
    pagination.totalPages || Math.ceil(posts.length / (pagination.limit || 4));

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  // Xử lý cập nhật bài viết
  const handleUpdate = async (values) => {
    try {
      const tagIds = [];
      for (const tagName of selectedTags) {
        const normalizedTagName = tagName.trim().toLowerCase();
        const existingTag = tags.find(
          (tag) => tag.tag_name.toLowerCase() === normalizedTagName
        );
        if (existingTag) {
          tagIds.push(existingTag._id);
        } else {
          const newTag = await createTag(tagName);
          if (newTag.EC === 0) {
            tagIds.push(newTag.data._id);
          } else {
            form.setFields([
              {
                name: "tags",
                errors: [`Không thể tạo thẻ "${tagName}": ${newTag.message}`],
              },
            ]);
            return;
          }
        }
      }

      const postData = {
        title: values.title,
        content,
        imageUrls,
      };

      const response = await updatePostAction(selectedPost._id, postData);
      if (response.EC === 0) {
        setIsModalVisible(false);
        form.resetFields();
        setContent("");
        setImageUrls([]);
        setSelectedTags([]);
      }
    } catch (error) {
      form.setFields([
        {
          name: "form",
          errors: [`Có lỗi xảy ra: ${error.message || "Không xác định"}`],
        },
      ]);
    }
  };

  // Xử lý xóa bài viết
  const handleDelete = async (postId) => {
    await deletePostAction(postId);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setContent("");
    setImageUrls([]);
    setSelectedTags([]);
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
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span
          style={{
            cursor: "pointer",
            display: "inline-block",
            maxWidth: "400px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
          }}
          title={text}
          onClick={() => console.log("Thông tin bài viết:", record)}
        >
          {text}
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
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
            disabled={isActionLoading}
          >
            Sửa
          </Button>
          <Button
            type="danger"
            onClick={() => handleDelete(record._id)}
            disabled={isActionLoading}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý bài viết</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
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
        title="Chỉnh sửa bài viết"
        visible={isModalVisible}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        width={600}
        bodyStyle={{
          maxHeight: "60vh",
          overflow: "auto",
          padding: "16px",
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input.TextArea
              placeholder="Nhập tiêu đề bài viết"
              size="large"
              autoSize
              style={{
                fontSize: "24px",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            />
          </Form.Item>
          <Form.Item
            name="tags"
            label="Thẻ"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hoặc thêm ít nhất một thẻ!",
              },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Chọn hoặc nhập thẻ mới"
              size="large"
              style={{ width: "100%" }}
              loading={tagsLoading}
              onChange={(value) => setSelectedTags(value)}
              value={selectedTags}
            >
              {tags.map((tag) => (
                <Select.Option key={tag._id} value={tag.tag_name}>
                  {tag.tag_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nội dung"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung bài viết!" },
              {
                validator: () => {
                  if (!content || content === "<p><br></p>") {
                    return Promise.reject(
                      new Error("Vui lòng nhập nội dung bài viết")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div
              ref={editorRef}
              style={{
                minHeight: "300px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isActionLoading}>
              Cập nhật
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPostPage;
