import { message } from "antd";
import axios from "axios";
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // Thay bằng upload preset của bạn
  formData.append("folder", "Document");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUD_NAME
      }/image/upload`, // Thay bằng cloud_name của bạn
      formData
    );
    console.log("Upload successful:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    message.error("Không thể upload ảnh, vui lòng thử lại!");
    return null;
  }
};
