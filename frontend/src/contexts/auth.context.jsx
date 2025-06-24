import { createContext, useContext, useState, useEffect } from "react";
import axios from "../services/axios.customize";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra token và lấy thông tin người dùng khi ứng dụng khởi tạo
  useEffect(() => {
    const fetchUserFromToken = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        try {
          const response = await axios.get("/users/account");
          setUser(response); // Lưu thông tin người dùng vào context
          localStorage.setItem("user", JSON.stringify(response));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error.message);
          // Nếu token không hợp lệ, xóa token và user
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUserFromToken();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext phải được sử dụng trong AuthProvider");
  }
  return context;
};
