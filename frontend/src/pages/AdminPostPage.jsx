/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Table,
  Image,
  Modal,
  Form,
  Input,
  Button,
  Select,
  Tag,
  AutoComplete,
  Space,
} from "antd";
import moment from "moment";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { usePosts } from "../features/post/hooks/usePost";
import { usePostActions } from "../features/post/hooks/usePostActions";
import { useQueryClient } from "@tanstack/react-query";
import { useTag } from "../features/tag/hooks/useTag";
import { useCategories } from "../features/category/hooks/useCategories";
import { useCourses } from "../features/course/hooks/useCourses";
import { uploadImageToCloudinary } from "../features/post/services/upload.service";
import AddNewModal from "../components/organisms/AddNewModal";

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
        console.log("Khởi tạo Quill Editor tại:", new Date().toLocaleString());
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
          console.log("Cập nhật nội dung Quill:", selectedPost.content);
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
        console.log("Hủy Quill Editor tại:", new Date().toLocaleString());
        quillRef.current.off("text-change");
        quillRef.current = null;
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      }
    };

    if (isModalVisible) {
      destroyQuill(); // Hủy instance cũ trước khi tạo mới
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

const AdminPostPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddCourseModalVisible, setIsAddCourseModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
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
  const { categories, loading: categoriesLoading } = useCategories();
  const { courses, loading: coursesLoading, addCourse } = useCourses();

  // Xử lý mở modal
  const handleEdit = useCallback((post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  }, []);

  // Xử lý đóng modal
  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setContent("");
    setImageUrls([]);
    setSelectedTags([]);
    setSearchValue("");
    setSelectedPost(null);
  }, [form]);

  // Điền dữ liệu vào form khi mở modal
  useEffect(() => {
    if (selectedPost) {
      form.setFieldsValue({
        title: selectedPost.title || "",
        category_id: selectedPost.category_id?._id || "",
        course_name: selectedPost.course_id
          ? `${selectedPost.course_id.course_code} - ${selectedPost.course_id.course_name}`
          : "",
        tags: selectedPost.tags?.map((tag) => tag.tag_name) || [],
        status: selectedPost.status || "pending",
      });
      setSearchValue(
        selectedPost.course_id
          ? `${selectedPost.course_id.course_code} - ${selectedPost.course_id.course_name}`
          : ""
      );
      setSelectedTags(selectedPost.tags?.map((tag) => tag.tag_name) || []);
      setImageUrls(
        selectedPost.documents
          ?.filter((doc) => doc.type === "image")
          .map((doc) => doc.document_url) || []
      );
      setContent(selectedPost.content || "");
    }
  }, [selectedPost, form]);

  // Cập nhật danh sách khóa học lọc theo tìm kiếm
  useEffect(() => {
    setFilteredCourses(
      courses
        .filter((course) =>
          `${course.course_code} - ${course.course_name}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        .map((course) => ({
          value: `${course.course_code} - ${course.course_name}`,
          label: `${course.course_code} - ${course.course_name}`,
        }))
    );
  }, [searchValue, courses]);

  // Tính toán dataSource cho trang hiện tại
  const dataSource = useMemo(() => {
    const pageSize = pagination.limit || 4;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let filteredPosts = posts;

    // Lọc bài viết theo tìm kiếm
    if (searchText) {
      filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filteredPosts.slice(startIndex, endIndex).map((post) => ({
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
      category_id: post.category_id,
      course_id: post.course_id,
    }));
  }, [posts, currentPage, pagination.limit, searchText]);

  // Tính toán tổng số trang
  const totalPages =
    pagination.totalPages || Math.ceil(posts.length / (pagination.limit || 4));

  // Xử lý cập nhật bài viết
  const handleUpdate = async (values) => {
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
        status: values.status,
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
  };

  // Xử lý xóa bài viết
  const handleDelete = async (postId) => {
    await deletePostAction(postId);
  };

  // Xử lý thêm khóa học mới
  const handleAddNewCourse = (values) => {
    addCourse({ course_name: values.name, course_code: values.code });
    setIsAddCourseModalVisible(false);
  };

  // Dropdown render cho AutoComplete
  const dropdownRender = (menu) => (
    <div>
      {menu}
      <Button
        type="link"
        onClick={() => setIsAddCourseModalVisible(true)}
        style={{ width: "100%", padding: "8px", textAlign: "center" }}
      >
        Thêm khóa học mới
      </Button>
    </div>
  );

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
      sorter: (a, b) => a.title.localeCompare(b.title),
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
      sorter: (a, b) => a.likeCount - b.likeCount,
    },
    {
      title: "Số lượt bình luận",
      dataIndex: "commentCount",
      key: "commentCount",
      sorter: (a, b) => a.commentCount - b.commentCount,
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
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
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
            disabled={isActionLoading}
          >
            Sửa
          </Button>
          <Button
            variant="outlined"
            color="red"
            onClick={() => handleDelete(record._id)}
            disabled={isActionLoading}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  return (
    <div>
      <h2>Quản lý bài viết</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề..."
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>
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
        open={isModalVisible}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnHidden={true}
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
                fontSize: "24px",
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
              popupRender={dropdownRender}
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
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              size="large"
              style={{ width: "100%" }}
            >
              <Select.Option value="accepted">
                <Tag color="green">Accepted</Tag>
              </Select.Option>
              <Select.Option value="pending">
                <Tag color="orange">Pending</Tag>
              </Select.Option>
              <Select.Option value="rejected">
                <Tag color="red">Rejected</Tag>
              </Select.Option>
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
      <AddNewModal
        title="Thêm khóa học mới"
        visible={isAddCourseModalVisible}
        onOk={handleAddNewCourse}
        onCancel={() => setIsAddCourseModalVisible(false)}
        loading={coursesLoading}
        placeholder="Nhập tên khóa học"
        fields={[
          { name: "name", label: "Tên khóa học", required: true },
          { name: "code", label: "Mã khóa học", required: true },
        ]}
        minLength={3}
        maxLength={50}
      />
    </div>
  );
};

export default AdminPostPage;
