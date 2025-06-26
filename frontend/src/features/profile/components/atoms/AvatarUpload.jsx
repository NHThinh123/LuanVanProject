import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, notification, Upload } from "antd";
import React, { useEffect } from "react";
import { useAuthContext } from "../../../../contexts/auth.context";
import { useAuth } from "../../../auth/hooks/useAuth";

const AvatarUpload = ({ avatarUrl, onAvatarChange, initialAvatar }) => {
  const { user } = useAuthContext();
  const { handleUpdateAvatar, updateAvatarLoading } = useAuth();

  // Đồng bộ currentAvatar với user.avatar_url
  useEffect(() => {
    if (user?.avatar_url) {
      onAvatarChange(user.avatar_url); // Cập nhật avatarUrl trong EditProfilePage
    }
  }, [user?.avatar_url, onAvatarChange]);

  const handleFileChange = (info) => {
    const file = info.file; // Lấy file trực tiếp từ info.file
    if (!file || !file.type || !file.type.startsWith("image/")) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn một file ảnh hợp lệ (jpg, png, jpeg)",
      });
      return;
    }

    // Kiểm tra kích thước file (khớp với backend giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log("File too large:", file.size);
      notification.error({
        message: "Lỗi",
        description: "File ảnh không được vượt quá 10MB",
      });
      return;
    }

    // Gọi handleUpdateAvatar, để useAuth xử lý response
    handleUpdateAvatar(file);
  };

  return (
    <Flex justify="center" align="center" vertical>
      <Avatar
        size={100}
        src={user?.avatar_url || avatarUrl || initialAvatar}
        style={{ marginBottom: "16px" }}
      />
      <Upload
        name="avatar"
        showUploadList={false}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        disabled={updateAvatarLoading}
        beforeUpload={() => false} // Ngăn upload tự động
      >
        <Button icon={<UploadOutlined />} loading={updateAvatarLoading}>
          Tải lên avatar mới
        </Button>
      </Upload>
    </Flex>
  );
};

export default AvatarUpload;
