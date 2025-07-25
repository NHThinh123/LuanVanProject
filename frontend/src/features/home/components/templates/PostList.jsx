/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  List,
  Avatar,
  Flex,
  Typography,
  Popover,
  Row,
  Col,
  Tag,
  Spin,
  Menu,
  Modal,
  Form,
  Input,
  Button,
  Select,
  AutoComplete,
  Dropdown,
} from "antd";
import AvatarCustom from "../../../../components/molecules/AvatarCustom";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { formatDate } from "../../../../constants/formatDate";
import SkeletonLoading from "../../../../components/atoms/SkeletonLoading";
import ActionButtons from "../../../post/components/atoms/ActionButtons";
import { getAllParagraphs } from "../../../../constants/getAllParagraphs";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { usePostActions } from "../../../post/hooks/usePostActions";
import { useAuthContext } from "../../../../contexts/auth.context";
import { useTag } from "../../../tag/hooks/useTag";
import { useCategories } from "../../../category/hooks/useCategories";
import { useCourses } from "../../../course/hooks/useCourses";
import { uploadImageToCloudinary } from "../../../post/services/upload.service";
import { EllipsisOutlined } from "@ant-design/icons";

// Hook để lấy kích thước màn hình
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const { Text } = Typography;

// Component QuillEditor
const QuillEditor = ({
  content,
  setContent,
  selectedPost,
  isModalVisible,
  setImageUrls,
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initializeQuill = () => {
      if (!quillRef.current && editorRef.current && isModalVisible) {
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
                    if (file && isMounted && quillRef.current) {
                      try {
                        const imageUrl = await uploadImageToCloudinary(file);
                        if (imageUrl) {
                          const range = quillRef.current.getSelection() || {
                            index: 0,
                          };
                          quillRef.current.insertEmbed(
                            range.index,
                            "image",
                            imageUrl
                          );
                          setContent(quillRef.current.root.innerHTML);
                          setImageUrls((prev) => [...prev, imageUrl]);
                        }
                      } catch (error) {
                        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
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
          if (isMounted && quillRef.current) {
            setContent(quillRef.current.root.innerHTML);
          }
        });

        if (selectedPost && selectedPost.content) {
          quillRef.current.root.innerHTML = selectedPost.content;
          setContent(selectedPost.content);
        } else {
          quillRef.current.root.innerHTML = "";
          setContent("");
        }
      }
    };

    const destroyQuill = () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      }
    };

    if (isModalVisible) {
      destroyQuill();
      initializeQuill();
    } else {
      destroyQuill();
    }

    return () => {
      isMounted = false;
      destroyQuill();
    };
  }, [isModalVisible, selectedPost, setContent, setImageUrls]);

  return (
    <div
      ref={editorRef}
      style={{
        minHeight: "300px",
        border: "1px solid #d9d9d9",
        borderRadius: "4px",
      }}
    />
  );
};

const PostList = ({ posts = [], isLoading }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    deletePostAction,
    updatePostAction,
    isLoading: isActionLoading,
  } = usePostActions(queryClient);
  const { user } = useAuthContext();
  const { tags, tagsLoading, createTag } = useTag();
  const { categories, loading: categoriesLoading } = useCategories();
  const { courses, loading: coursesLoading } = useCourses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [form] = Form.useForm();

  // Lấy kích thước màn hình
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

  // Memoize filteredCourses to prevent unnecessary re-renders
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) =>
        `${course.course_code} - ${course.course_name}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
      .map((course) => ({
        value: `${course.course_code} - ${course.course_name}`,
        label: `${course.course_code} - ${course.course_name}`,
      }));
  }, [courses, searchValue]);

  // Điền dữ liệu vào form khi selectedPost thay đổi
  useEffect(() => {
    if (selectedPost) {
      const initialValues = {
        title: selectedPost.title || "",
        category_id: selectedPost.category_id?._id || "",
        course_name: selectedPost.course_id
          ? `${selectedPost.course_id.course_code} - ${selectedPost.course_id.course_name}`
          : "",
        tags: selectedPost.tags?.map((tag) => tag.tag_name) || [],
      };
      form.setFieldsValue(initialValues);
      setSearchValue(initialValues.course_name);
      setSelectedTags(initialValues.tags);
      setImageUrls(
        selectedPost.documents
          ?.filter((doc) => doc.type === "image")
          .map((doc) => doc.document_url) || []
      );
      setContent(selectedPost.content || "");
    }
  }, [selectedPost, form]);

  const handleEdit = useCallback((post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setContent("");
    setImageUrls([]);
    setSelectedTags([]);
    setSearchValue("");
    setSelectedPost(null);
  }, [form]);

  const handleUpdate = useCallback(
    async (values) => {
      try {
        const [selectedCourseCode, selectedCourseName] = values.course_name
          .split(" - ")
          .map((str) => str.trim());

        const selectedCourse = courses.find(
          (course) =>
            course.course_code === selectedCourseCode &&
            course.course_name === selectedCourseName
        );

        if (!selectedCourse) {
          form.setFields([
            {
              name: "course_name",
              errors: ["Khóa học không hợp lệ!"],
            },
          ]);
          return;
        }

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
          category_id: values.category_id,
          course_id: selectedCourse._id,
          tag_ids: tagIds,
        };

        const response = await updatePostAction(selectedPost._id, postData);
        if (response.EC === 0) {
          handleCancel();
        }
      } catch (error) {
        form.setFields([
          {
            name: "form",
            errors: [`Có lỗi xảy ra: ${error.message || "Không xác định"}`],
          },
        ]);
      }
    },
    [
      courses,
      tags,
      selectedPost,
      content,
      imageUrls,
      selectedTags,
      updatePostAction,
      handleCancel,
      form,
      createTag,
    ]
  );

  const handleDelete = useCallback((postId) => {
    setPostIdToDelete(postId);
    setIsDeleteModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (postIdToDelete) {
      await deletePostAction(postIdToDelete);
      setIsDeleteModalVisible(false);
      setPostIdToDelete(null);
    }
  }, [postIdToDelete, deletePostAction]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalVisible(false);
    setPostIdToDelete(null);
  }, []);

  const getMenuContent = useCallback(
    (postId, post) => (
      <Flex vertical gap={8}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEdit(post)}
          block
        >
          Chỉnh sửa
        </Button>
        <Button
          variant="outlined"
          color="red"
          key="delete"
          onClick={() => handleDelete(postId)}
          block
        >
          Xóa
        </Button>
      </Flex>
    ),
    [handleEdit, handleDelete]
  );

  if (isLoading) {
    return <SkeletonLoading />;
  }
  if (!posts || posts.length === 0) {
    return (
      <Row justify="center" style={{ marginTop: 20 }}>
        <Col>
          <Text type="secondary">Chưa có bài viết nào</Text>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <List
        itemLayout="vertical"
        dataSource={posts}
        renderItem={(item) => (
          <List.Item
            key={item._id}
            style={{ marginBottom: isMobile ? 16 : isTablet ? 20 : 28 }}
            styles={{
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
            actions={[
              <ActionButtons
                postId={item._id}
                likeCount={item.likeCount || 0}
                isLiked={item.isLiked || false}
                commentCount={item.commentCount || 0}
              />,
              <Flex align="center" gap={8}>
                <span style={{ fontSize: isMobile ? 12 : isTablet ? 14 : 16 }}>
                  {formatDate(item?.createdAt)}
                </span>
                {user?._id === item.user_id?._id && (
                  <Popover
                    content={getMenuContent(item._id, item)}
                    trigger="hover"
                    placement="top"
                  >
                    <EllipsisOutlined
                      style={{
                        fontSize: isMobile ? 16 : 18,
                        cursor: "pointer",
                        marginLeft: 8,
                      }}
                    />
                  </Popover>
                )}
              </Flex>,
            ]}
            extra={
              item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    maxWidth: isMobile ? 150 : isTablet ? 200 : 250,
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              )
            }
          >
            <Flex justify="space-between" align="center">
              <AvatarCustom
                src={item.user_id?.avatar_url || ""}
                name={item.user_id?.full_name || "Unknown"}
                size={isMobile ? 28 : isTablet ? 32 : 36}
                color={"#000"}
                user_id={item.user_id?._id}
                isFollowing={item.user_id?.isFollowing || false}
                follower={item.user_id?.followers_count || 0}
                fontWeight="normal"
              />
              <Flex justify="end" wrap>
                {item.course_id && (
                  <Tag
                    color="blue"
                    style={{ fontSize: 12, cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/posts/course/${item.course_id?._id}`)
                    }
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    {item?.course_id?.course_code} -{" "}
                    {item?.course_id?.course_name}
                  </Tag>
                )}
                {item.category_id && (
                  <Tag color="green" style={{ fontSize: 12 }}>
                    {item?.category_id?.category_name}
                  </Tag>
                )}
              </Flex>
            </Flex>

            <List.Item.Meta
              style={{ minHeight: isMobile ? 60 : 80, margin: 0 }}
              title={
                <a
                  href={`/posts/${item?._id}`}
                  style={{
                    textDecoration: "none",
                    fontSize: isMobile ? 16 : isTablet ? 18 : 20,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  {item?.title}
                </a>
              }
              description={
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: isMobile ? 1 : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: getAllParagraphs(item?.content),
                  }}
                />
              }
            />
            <Flex gap="4px 0" wrap style={{ marginTop: 8 }}>
              {item.tags
                ?.slice(0, isMobile ? 2 : isTablet ? 3 : 4)
                .map((tag) => (
                  <Tag
                    key={tag._id}
                    color="#222831"
                    onClick={() => navigate(`/posts/tag/${tag._id}`)}
                    style={{
                      cursor: "pointer",
                      fontSize: isMobile ? 12 : isTablet ? 13 : 14,
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    #{tag.tag_name}
                  </Tag>
                ))}
            </Flex>
          </List.Item>
        )}
      />
      <Modal
        title="Chỉnh sửa bài viết"
        open={isModalVisible}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        width={isMobile ? "90%" : isTablet ? "95%" : 800}
        destroyOnClose={true}
        styles={{
          body: { maxHeight: "80vh", overflow: "auto", padding: "16px" },
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
                fontSize: isMobile ? 18 : isTablet ? 20 : 24,
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Danh mục bài viết"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              placeholder="Chọn danh mục"
              size="large"
              style={{ width: "100%" }}
              loading={categoriesLoading}
            >
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="course_name"
            label="Khóa học liên quan"
            rules={[
              { required: true, message: "Vui lòng chọn hoặc thêm khóa học" },
            ]}
          >
            <AutoComplete
              options={filteredCourses}
              placeholder="Nhập để tìm kiếm hoặc chọn khóa học"
              size="large"
              onSelect={(value) => {
                form.setFieldsValue({ course_name: value });
                setSearchValue(value);
              }}
              onSearch={(value) => setSearchValue(value)}
              style={{ width: "100%" }}
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
            <QuillEditor
              content={content}
              setContent={setContent}
              selectedPost={selectedPost}
              isModalVisible={isModalVisible}
              setImageUrls={setImageUrls}
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
      <Modal
        title="Xác nhận xóa bài viết"
        open={isDeleteModalVisible}
        centered={true}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        styles={{
          body: { padding: "16px" },
        }}
      >
        <p>
          Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn
          tác.
        </p>
      </Modal>
    </>
  );
};

export default PostList;
