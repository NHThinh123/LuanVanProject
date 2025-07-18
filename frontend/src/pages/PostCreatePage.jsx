import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCreatePost } from "../features/post/hooks/useCreatePost";
import { useCategories } from "../features/category/hooks/useCategories";
import { useCourses } from "../features/course/hooks/useCourses";
import { useTag } from "../features/tag/hooks/useTag";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  AutoComplete,
  message,
} from "antd";
import AddNewModal from "../components/organisms/AddNewModal";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../features/post/services/upload.service";

const { Title } = Typography;

const PostCreatePage = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // State lưu danh sách URL ảnh
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { handleCreatePost, isLoading } = useCreatePost();
  const { categories, loading: categoriesLoading } = useCategories();
  const { courses, loading: coursesLoading, addCourse } = useCourses();
  const { tags, tagsLoading, createTag, addTagsToPost } = useTag();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  // Hàm upload ảnh lên Cloudinary

  // Tùy chỉnh Quill để xử lý upload ảnh
  useEffect(() => {
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
                    const range = quillRef.current.getSelection();
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

    return () => {
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      course_name: "",
      tags: [],
    });
  }, [form]);

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

  const onFinish = async (values) => {
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
            message.error(`Không thể tạo thẻ "${tagName}": ${newTag.message}`);
          }
        }
      }

      // Thêm imageUrls vào postData
      const postData = {
        course_id: selectedCourse._id,
        category_id: values.category_id,
        title: values.title,
        content,
        imageUrls, // Gửi danh sách URL ảnh
      };

      handleCreatePost(postData, {
        onSuccess: async (response) => {
          if (tagIds.length > 0) {
            await addTagsToPost({
              post_id: response.data._id,
              tag_ids: tagIds,
            });
          }
          form.resetFields();
          setContent("");
          setImageUrls([]); // Reset danh sách URL ảnh
          quillRef.current.root.innerHTML = "";
          setSearchValue("");
          setSelectedTags([]);
          navigate("/profile");
        },
        onError: (error) => {
          message.error(
            `Lỗi khi tạo bài viết: ${error.message || "Không xác định"}`
          );
        },
      });
    } catch (error) {
      message.error(`Có lỗi xảy ra: ${error.message || "Không xác định"}`);
    }
  };

  const handleAddNewCourse = (values) => {
    addCourse({ course_name: values.name, course_code: values.code });
    setIsModalVisible(false);
  };

  const dropdownRender = (menu) => (
    <div>
      {menu}
      <Button
        type="link"
        onClick={() => setIsModalVisible(true)}
        style={{ width: "100%", padding: "8px", textAlign: "center" }}
      >
        Thêm khóa học mới
      </Button>
    </div>
  );

  return (
    <Row justify="center" style={{ padding: "20px" }}>
      <Col span={18}>
        <Title level={2} style={{ marginBottom: "20px", textAlign: "center" }}>
          Tạo bài viết mới
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề bài viết" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập tiêu đề bài viết"
              size="large"
              variant="underlined"
              style={{
                fontSize: "24px",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
              autoSize
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
                message: "Vui lòng chọn hoặc thêm ít nhất một thẻ",
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
              { required: true, message: "Vui lòng nhập nội dung bài viết" },
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
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
          </Form.Item>
        </Form>
        <AddNewModal
          title="Thêm khóa học mới"
          visible={isModalVisible}
          onOk={handleAddNewCourse}
          onCancel={() => setIsModalVisible(false)}
          loading={coursesLoading}
          placeholder="Nhập tên khóa học"
          fields={[
            { name: "name", label: "Tên khóa học", required: true },
            { name: "code", label: "Mã khóa học", required: true },
          ]}
          minLength={3}
          maxLength={50}
        />
      </Col>
    </Row>
  );
};

export default PostCreatePage;
