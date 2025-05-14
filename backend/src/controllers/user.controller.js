const {
  createUserService,
  loginService,
  getUsersService,
  getUserByIdService,
  updateUserService,
} = require("../services/user.service");

const createUser = async (req, res) => {
  const { email, username, password, role } = req.body;
  const data = await createUserService(email, username, password, role);
  return res.status(200).json(data);
};
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};
const getUsers = async (req, res) => {
  const data = await getUsersService();
  return res.status(200).json(data);
};
const getUserById = async (req, res) => {
  const data = await getUserByIdService(req.params.id);
  return res.status(200).json(data);
};
const updateUser = async (req, res) => {
  const updateData = req.body;
  const data = await updateUserService(req.params.id, updateData);
  return res.status(200).json(data);
};
const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  handleLogin,
  getAccount,
  updateUser,
};
