/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { Table, Modal, Form, Input, Button } from "antd";
import moment from "moment";
import { useCategories } from "../features/category/hooks/useCategories";
import { useCategoryActions } from "../features/category/hooks/useCategoryActions";

const AdminCategoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // Hooks
  const { categories, loading: isCategoriesLoading } = useCategories();
  const {
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading: isActionLoading,
  } = useCategoryActions();

  // Handle edit category
  const handleEdit = useCallback((category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  }, []);

  // Handle create category
  const handleCreateClick = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  // Handle cancel edit modal
  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCategory(null);
  }, [form]);

  // Handle cancel create modal
  const handleCreateCancel = useCallback(() => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  }, [createForm]);

  // Populate form with category data for edit
  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        category_name: selectedCategory.category_name || "",
      });
    }
  }, [selectedCategory, form]);

  // Handle update category
  const handleUpdate = async (values) => {
    try {
      const categoryData = {
        category_name: values.category_name,
      };

      await updateCategory({ categoryId: selectedCategory._id, categoryData });
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

  // Handle create category
  const handleCreate = async (values) => {
    try {
      const categoryData = {
        category_name: values.category_name,
      };

      await createCategory(categoryData);
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

  // Handle delete category
  const handleDelete = async (categoryId) => {
    await deleteCategory(categoryId);
  };

  // Table data source
  const dataSource = categories.map((category) => ({
    key: category._id,
    _id: category._id,
    category_name: category.category_name,
    createdAt: category.createdAt,
  }));

  // Table columns
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
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
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
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
        <h2>Quản lý danh mục</h2>
        <Button
          type="primary"
          onClick={handleCreateClick}
          disabled={isActionLoading}
        >
          Thêm danh mục
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isCategoriesLoading || isActionLoading}
        pagination={{
          pageSize: 10,
          total: categories.length,
          current: currentPage,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: "max-content" }}
      />
      {/* Modal for editing category */}
      <Modal
        title="Chỉnh sửa danh mục"
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
            name="category_name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" size="large" />
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
      {/* Modal for creating category */}
      <Modal
        title="Thêm danh mục mới"
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
            name="category_name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" size="large" />
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

export default AdminCategoryPage;
