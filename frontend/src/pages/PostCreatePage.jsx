import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCreatePost } from "../features/post/hooks/useCreatePost";
import { useCategories } from "../features/category/hooks/useCategories";
import { useCourses } from "../features/course/hooks/useCourses";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  AutoComplete,
} from "antd";
import AddNewModal from "../components/organisms/AddNewModal";

const { Title } = Typography;

const PostCreatePage = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { handleCreatePost, isLoading } = useCreatePost();
  const { categories, loading: categoriesLoading } = useCategories();
  const { courses, loading: coursesLoading, addCourse } = useCourses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Initialize Quill editor
  useEffect(() => {
    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
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
      course_name: "", // Reset course_name
    });
  }, [form]);

  // Update filtered courses based on search value
  useEffect(() => {
    setFilteredCourses(
      courses
        .filter((course) =>
          `${course.course_code} - ${course.course_name}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        .map((course) => ({
          value: `${course.course_code} - ${course.course_name}`, // Set value as course_code - course_name
          label: `${course.course_code} - ${course.course_name}`, // Display as course_code - course_name
        }))
    );
  }, [searchValue, courses]);

  const onFinish = (values) => {
    // Extract course_code and course_name from the selected value
    const [selectedCourseCode, selectedCourseName] = values.course_name
      .split(" - ")
      .map((str) => str.trim());

    // Find the course_id based on both course_code and course_name
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

    handleCreatePost(
      {
        course_id: selectedCourse._id, // Use the matched course_id
        category_id: values.category_id,
        title: values.title,
        content,
      },
      {
        onSuccess: () => {
          form.resetFields();
          setContent("");
          quillRef.current.root.innerHTML = "";
          setSearchValue(""); // Reset search value
        },
      }
    );
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
            <Input
              placeholder="Nhập tiêu đề bài viết"
              size="large"
              style={{
                fontSize: "24px",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Danh mục"
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
            label="Khóa học"
            rules={[
              { required: true, message: "Vui lòng chọn hoặc thêm khóa học" },
            ]}
          >
            <AutoComplete
              options={filteredCourses}
              placeholder="Nhập để tìm kiếm hoặc chọn khóa học"
              size="large"
              onSelect={(value) => {
                form.setFieldsValue({ course_name: value }); // Set course_name in form
                setSearchValue(value); // Update search value on select
              }}
              onSearch={(value) => setSearchValue(value)} // Update search value on input
              popupRender={dropdownRender}
              style={{ width: "100%" }}
            />
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
        <Card
          title={<Title level={4}>Bài viết khi được hiển thị</Title>}
          bordered
          style={{
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            marginTop: "16px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ minHeight: "100px" }}
          />
        </Card>
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
