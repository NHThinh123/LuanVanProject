import React, { useState, useCallback, useEffect } from "react";
import { Table, Modal, Form, Input, Button } from "antd";
import moment from "moment";
import { useCourses } from "../features/course/hooks/useCourses";
import { useCourseActions } from "../features/course/hooks/useCourseActions";

const AdminCoursePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // Hooks
  const { courses, loading: isCoursesLoading, addCourse } = useCourses();
  const {
    updateCourse,
    deleteCourse,
    isLoading: isActionLoading,
  } = useCourseActions();

  // Handle edit course
  const handleEdit = useCallback((course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  }, []);

  // Handle create course
  const handleCreateClick = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  // Handle cancel edit modal
  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCourse(null);
  }, [form]);

  // Handle cancel create modal
  const handleCreateCancel = useCallback(() => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  }, [createForm]);

  // Populate form with course data for edit
  useEffect(() => {
    if (selectedCourse) {
      form.setFieldsValue({
        course_name: selectedCourse.course_name || "",
        course_code: selectedCourse.course_code || "",
      });
    }
  }, [selectedCourse, form]);

  // Handle update course
  const handleUpdate = async (values) => {
    try {
      const courseData = {
        course_name: values.course_name,
        course_code: values.course_code,
      };

      await updateCourse({ courseId: selectedCourse._id, courseData });
      handleCancel();
    } catch (error) {
      form.setFields([
        {
          name: "form",
          errors: [`Có lỗi xảy ra: ${error.message || "Không xác định"}`],
        },
      ]);
    }
  };

  // Handle create course
  const handleCreate = async (values) => {
    try {
      const courseData = {
        course_name: values.course_name,
        course_code: values.course_code,
      };

      await addCourse(courseData);
      handleCreateCancel();
    } catch (error) {
      createForm.setFields([
        {
          name: "form",
          errors: [`Có lỗi xảy ra: ${error.message || "Không xác định"}`],
        },
      ]);
    }
  };

  // Handle delete course
  const handleDelete = async (courseId) => {
    await deleteCourse(courseId);
  };

  // Table data source
  const dataSource = courses.map((course) => ({
    key: course._id,
    _id: course._id,
    course_name: course.course_name,
    course_code: course.course_code,
    createdAt: course.createdAt,
  }));

  // Table columns
  const columns = [
    {
      title: "Tên khóa học",
      dataIndex: "course_name",
      key: "course_name",
      render: (text) => (
        <span
          style={{
            cursor: "pointer",
            display: "inline-block",
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
          }}
          title={text}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.course_name.localeCompare(b.course_name),
    },
    {
      title: "Mã khóa học",
      dataIndex: "course_code",
      key: "course_code",
      render: (text) => (
        <span
          style={{
            cursor: "pointer",
            display: "inline-block",
            maxWidth: "150px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
          }}
          title={text}
        >
          {text || "-"}
        </span>
      ),
      sorter: (a, b) =>
        (a.course_code || "").localeCompare(b.course_code || ""),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Quản lý khóa học</h2>
        <Button
          type="primary"
          onClick={handleCreateClick}
          disabled={isActionLoading}
        >
          Thêm khóa học
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isCoursesLoading || isActionLoading}
        pagination={{
          pageSize: 10,
          total: courses.length,
          current: currentPage,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: "max-content" }}
      />
      {/* Modal for editing course */}
      <Modal
        title="Chỉnh sửa khóa học"
        open={isModalVisible}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnHidden={true}
        styles={{
          body: { maxHeight: "60vh", overflow: "auto", padding: "16px" },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="course_name"
            label="Tên khóa học"
            rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
          >
            <Input placeholder="Nhập tên khóa học" size="large" />
          </Form.Item>
          <Form.Item
            name="course_code"
            label="Mã khóa học"
            rules={[{ required: false }]}
          >
            <Input placeholder="Nhập mã khóa học (tùy chọn)" size="large" />
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
      {/* Modal for creating course */}
      <Modal
        title="Thêm khóa học mới"
        open={isCreateModalVisible}
        centered={true}
        onCancel={handleCreateCancel}
        footer={null}
        width={600}
        destroyOnHidden={true}
        styles={{
          body: { maxHeight: "60vh", overflow: "auto", padding: "16px" },
        }}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="course_code"
            label="Mã khóa học"
            rules={[{ required: false }]}
          >
            <Input placeholder="Nhập mã khóa học" size="large" />
          </Form.Item>
          <Form.Item
            name="course_name"
            label="Tên khóa học"
            rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
          >
            <Input placeholder="Nhập tên khóa học" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isActionLoading}>
              Thêm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCreateCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCoursePage;
