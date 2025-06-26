import axios from "../../../services/axios.customize";

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post("/users/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi server");
  }
};

export const signupUser = async ({ email, password, confirmPassword }) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }
    const response = await axios.post("/users/register", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi server");
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.put(`/users/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật thông tin người dùng");
  }
};

export const updateAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axios.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật avatar");
  }
};
