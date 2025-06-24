import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { message } from "antd";
import { loginUser, signupUser, updateUser } from "../services/auth.service";
import { useAuthContext } from "../../../contexts/auth.context";

export const useAuth = () => {
  const { login, logout, user, access_token } = useAuthContext();
  const navigate = useNavigate();

  // Mutation để đăng nhập người dùng
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.EC === 0) {
        login(data.data, data.access_token);
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi đăng nhập:", error.message);
      message.error(error.message || "Đăng nhập thất bại, vui lòng thử lại");
    },
  });

  // Mutation để đăng ký người dùng
  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.EC === 0) {
        login(data.data, data.access_token);
        message.success("Đăng ký thành công");
        navigate("/information");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi đăng ký:", error.message);
      message.error(error.message || "Đăng ký thất bại, vui lòng thử lại");
    },
  });

  // Mutation để cập nhật thông tin người dùng
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data) => {
      if (data.message === "Cập nhật thông tin người dùng thành công") {
        login(data.data, data.access_token);
        message.success("Cập nhật thông tin thành công");
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      console.error("Lỗi cập nhật thông tin:", error.message);
      message.error(
        error.message || "Cập nhật thông tin thất bại, vui lòng thử lại"
      );
    },
  });

  // Hàm xử lý đăng nhập, đăng ký, cập nhật thông tin và đăng xuất
  const handleLogin = (values) => {
    loginMutation.mutate(values);
  };

  const handleSignup = (values) => {
    signupMutation.mutate(values);
  };

  const handleUpdateUser = (values) => {
    console.log(access_token);
    if (user?.id) {
      updateUserMutation.mutate({ id: user.id, data: values });
    } else {
      message.error("Không tìm thấy thông tin người dùng");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    handleLogin,
    handleSignup,
    handleUpdateUser,
    handleLogout,
    isLoading: loginMutation.isLoading,
    error: loginMutation.error,
  };
};
