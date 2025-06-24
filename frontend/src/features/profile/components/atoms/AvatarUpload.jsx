import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, message, Upload } from "antd";
import React, { useState } from "react";

const AvatarUpload = ({ avatarUrl, onAvatarChange, initialAvatar }) => {
  const [currentAvatar, setCurrentAvatar] = useState(
    avatarUrl || initialAvatar
  );

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      const newAvatarUrl = info.file.response.url;
      setCurrentAvatar(newAvatarUrl);
      onAvatarChange(newAvatarUrl);
      message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại`);
    }
  };

  return (
    <Flex justify="center" align="center" vertical>
      <Avatar size={100} src={currentAvatar} style={{ marginBottom: "16px" }} />
      <Upload
        name="avatar"
        action="/api/upload/avatar"
        showUploadList={false}
        onChange={handleAvatarChange}
      >
        <Button icon={<UploadOutlined />}>Tải lên avatar mới</Button>
      </Upload>
    </Flex>
  );
};

export default AvatarUpload;
