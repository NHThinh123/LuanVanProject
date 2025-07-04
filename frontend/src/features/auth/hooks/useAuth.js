import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import {
  loginUser,
  signupUser,
  updateUser,
  updateAvatar,
} from "../services/auth.service";
import { useAuthContext } from "../../../contexts/auth.context";

export const useAuth = () => {
  const { login, logout, user } = useAuthContext();
  const navigate = useNavigate();

  // Mutation để đăng nhập người dùng
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.EC === 0) {
        notification.success({
          message: "Đăng nhập thành công",
        });
        login(data.data, data.access_token);
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi đăng nhập:", error.message);
      notification.error({
        message: error.message || "Đăng nhập thất bại, vui lòng thử lại",
      });
    },
  });

  // Mutation để đăng ký người dùng
  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.EC === 0) {
        login(data.data, data.access_token);
        notification.success({
          message: "Đăng ký thành công",
        });
        navigate("/information");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi đăng ký:", error.message);
      notification.error({
        message: error.message || "Đăng ký thất bại, vui lòng thử lại",
      });
    },
  });

  // Mutation để cập nhật thông tin người dùng
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data) => {
      if (data.message === "Cập nhật thông tin người dùng thành công") {
        login(data.data, data.access_token);
        notification.success({
          message: "Cập nhật thông tin thành công",
        });
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi cập nhật thông tin:", error.message);
      notification.error({
        message:
          error.message || "Cập nhật thông tin thất bại, vui lòng thử lại",
      });
    },
  });

  // Mutation để cập nhật ảnh đại diện
  const updateAvatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: (data) => {
      if (data.EC === 0) {
        login(data.data, data.access_token);
        notification.success({
          message: "Cập nhật ảnh đại diện thành công",
        });
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi cập nhật ảnh đại diện:", error.message);
      notification.error({
        message:
          error.message || "Cập nhật ảnh đại diện thất bại, vui lòng thử lại",
      });
    },
  });

  // Hàm xử lý đăng nhập, đăng ký, cập nhật thông tin, cập nhật ảnh và đăng xuất
  const handleLogin = (values) => {
    loginMutation.mutate(values);
  };

  const handleSignup = (values) => {
    signupMutation.mutate(values);
  };

  const handleUpdateUser = (values) => {
    if (user?._id) {
      updateUserMutation.mutate({ id: user._id, data: values });
    } else {
      notification.error({
        message: "Không tìm thấy thông tin người dùng",
      });
    }
  };

  const handleUpdateAvatar = (file) => {
    updateAvatarMutation.mutate(file);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    handleLogin,
    handleSignup,
    handleUpdateUser,
    handleUpdateAvatar,
    handleLogout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    updateAvatarLoading: updateAvatarMutation.isPending, // Thêm trạng thái loading cho avatar
  };
};
