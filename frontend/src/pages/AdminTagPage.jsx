/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { Table, Modal, Form, Input, Button } from "antd";
import moment from "moment";
import { useTag } from "../features/tag/hooks/useTag";
import { useTagActions } from "../features/tag/hooks/useTagActions";

const AdminTagPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // Hooks
  const { tags, tagsLoading, createTag } = useTag();
  const { updateTag, deleteTag, isLoading: isActionLoading } = useTagActions();

  // Handle edit tag
  const handleEdit = useCallback((tag) => {
    setSelectedTag(tag);
    setIsModalVisible(true);
  }, []);

  // Handle create tag
  const handleCreateClick = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  // Handle cancel edit modal
  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedTag(null);
  }, [form]);

  // Handle cancel create modal
  const handleCreateCancel = useCallback(() => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  }, [createForm]);

  // Populate form with tag data for edit
  useEffect(() => {
    if (selectedTag) {
      form.setFieldsValue({
        tag_name: selectedTag.tag_name || "",
      });
    }
  }, [selectedTag, form]);

  // Handle update tag
  const handleUpdate = async (values) => {
    try {
      const tagData = {
        tag_name: values.tag_name,
      };

      await updateTag({ tagId: selectedTag._id, tagData });
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

  // Handle create tag
  const handleCreate = async (values) => {
    try {
      await createTag(values.tag_name);
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

  // Handle delete tag
  const handleDelete = async (tagId) => {
    await deleteTag(tagId);
  };

  // Table data source
  const dataSource = tags.map((tag) => ({
    key: tag._id,
    _id: tag._id,
    tag_name: tag.tag_name,
    post_count: tag.post_count || 0,
    createdAt: tag.createdAt,
  }));

  // Table columns
  const columns = [
    {
      title: "Tên thẻ",
      dataIndex: "tag_name",
      key: "tag_name",
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
      sorter: (a, b) => a.tag_name.localeCompare(b.tag_name),
    },
    {
      title: "Số bài viết",
      dataIndex: "post_count",
      key: "post_count",
      sorter: (a, b) => a.post_count - b.post_count,
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
        <h2>Quản lý thẻ</h2>
        <Button
          type="primary"
          onClick={handleCreateClick}
          disabled={isActionLoading}
        >
          Thêm thẻ
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={tagsLoading || isActionLoading}
        pagination={{
          pageSize: 10,
          total: tags.length,
          current: currentPage,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: "max-content" }}
      />
      {/* Modal for editing tag */}
      <Modal
        title="Chỉnh sửa thẻ"
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
            name="tag_name"
            label="Tên thẻ"
            rules={[{ required: true, message: "Vui lòng nhập tên thẻ!" }]}
          >
            <Input placeholder="Nhập tên thẻ" size="large" />
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
      {/* Modal for creating tag */}
      <Modal
        title="Thêm thẻ mới"
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
            name="tag_name"
            label="Tên thẻ"
            rules={[{ required: true, message: "Vui lòng nhập tên thẻ!" }]}
          >
            <Input placeholder="Nhập tên thẻ" size="large" />
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

export default AdminTagPage;
