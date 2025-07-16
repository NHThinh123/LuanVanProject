const User = require("../models/user.model");
const {
  createUserService,
  loginService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  updateAvatarService,
} = require("../services/user.service");

const createUser = async (req, res) => {
  const {
    email,
    password,
    role,
    bio,
    university_id,
    major_id,
    full_name,
    start_year,
    avatar_url,
  } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin",
      EC: 1,
    });
  }
  if (role === "admin" && req?.user?.role !== "admin") {
    return res.status(400).json({
      message: "Không có quyền tạo người dùng với vai trò admin",
      EC: 1,
    });
  }

  const data = await createUserService(
    email,
    password,
    role,
    bio,
    university_id,
    major_id,
    full_name,
    start_year,
    avatar_url
  );
  return res.status(data.EC === 0 ? 200 : data.EC === 1 ? 400 : 500).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập email và mật khẩu", EC: 1 });
  }
  const data = await loginService(email, password);
  return res.status(data.EC === 0 ? 200 : data.EC === 1 ? 400 : 500).json(data);
};

const getUsers = async (req, res) => {
  const current_user_id = req.user?._id; // Lấy từ middleware authentication
  const data = await getUsersService(req.query, current_user_id);
  return res.status(data.EC === 0 ? 200 : data.EC === 1 ? 400 : 500).json(data);
};

const getUserById = async (req, res) => {
  const current_user_id = req.user?._id; // Lấy từ middleware authentication
  const data = await getUserByIdService(req.params.id, current_user_id);
  return res.status(data.EC === 0 ? 200 : data.EC === 1 ? 400 : 500).json(data);
};

const updateUser = async (req, res) => {
  const updateData = req.body;
  const data = await updateUserService(req.params.id, updateData);
  return res.status(data.EC === 0 ? 200 : data.EC === 1 ? 400 : 500).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateAvatar = async (req, res) => {
  const user_id = req.user._id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Vui lòng chọn file ảnh", EC: 1 });
  }

  const result = await updateAvatarService(user_id, file);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  handleLogin,
  getAccount,
  updateUser,
  updateAvatar,
};
