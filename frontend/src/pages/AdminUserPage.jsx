/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  Image,
  Modal,
  Form,
  Input,
  Button,
  Select,
  Tag,
  Avatar,
} from "antd";
import moment from "moment";
import { useUsers } from "../features/user/hooks/useUsers";
import { useUserActions } from "../features/user/hooks/useUserActions";

const AdminUserPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Hooks
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers({});
  const {
    updateUser,
    deleteUser,
    isLoading: isActionLoading,
  } = useUserActions();

  // Handle edit user
  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  }, []);

  // Handle cancel modal
  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedUser(null);
  }, [form]);

  // Populate form with user data
  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "user",
        bio: selectedUser.bio || "",
        start_year: selectedUser.start_year || "",
      });
    }
  }, [selectedUser, form]);

  // Handle update user
  const handleUpdate = async (values) => {
    try {
      const userData = {
        full_name: values.full_name,
        email: values.email,
        role: values.role,
        bio: values.bio,
        start_year: values.start_year,
      };

      await updateUser({ userId: selectedUser._id, userData });
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

  // Handle delete user
  const handleDelete = async (userId) => {
    await deleteUser(userId);
  };

  // Table data source
  const dataSource = users.map((user) => ({
    key: user._id,
    _id: user._id,
    avatar_url: user.avatar_url,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    start_year: user.start_year,
    createdAt: user.createdAt,
    followers_count: user.followers_count || 0,
  }));

  // Table columns
  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar_url",
      key: "avatar_url",
      render: (avatar_url) => (
        <Avatar
          src={avatar_url || "https://via.placeholder.com/50"}
          size={"large"}
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "full_name",
      key: "full_name",
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
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={role === "admin" ? "blue" : "green"}
          style={{ textTransform: "capitalize" }}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Năm bắt đầu",
      dataIndex: "start_year",
      key: "start_year",
    },
    {
      title: "Số người theo dõi",
      dataIndex: "followers_count",
      key: "followers_count",
    },
    {
      title: "Ngày tạo",
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
      <h2>Quản lý người dùng</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isUsersLoading || isActionLoading}
        pagination={{
          pageSize: 10,
          total: users.length,
          current: currentPage,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalVisible}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose={true}
        styles={{
          body: { maxHeight: "60vh", overflow: "auto", padding: "16px" },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="full_name"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
            ]}
          >
            <Input placeholder="Nhập tên người dùng" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              size="large"
              style={{ width: "100%" }}
            >
              <Select.Option value="admin">
                <Tag color="blue">Admin</Tag>
              </Select.Option>
              <Select.Option value="user">
                <Tag color="green">User</Tag>
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="bio" label="Tiểu sử" rules={[{ required: false }]}>
            <Input.TextArea
              placeholder="Nhập tiểu sử"
              size="large"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item
            name="start_year"
            label="Năm bắt đầu"
            rules={[{ required: true, message: "Vui lòng nhập năm bắt đầu!" }]}
          >
            <Input placeholder="Nhập năm bắt đầu (ví dụ: 2025)" size="large" />
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

export default AdminUserPage;
