require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const createUserService = async (
  email,
  username,
  password,
  role,
  grade,
  major,
  school
) => {
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return {
        message: "Email đã tồn tại",
      };
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (role === "admin" && !req.user.role === "admin") {
      return {
        message: "Bạn không có quyền tạo tài khoản admin",
      };
    }
    let result = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
      role: role,
      grade: grade,
      major: major,
      school: school,
    });
    return {
      message: "Tạo tài khoản thành công",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUsersService = async () => {
  try {
    let result = await User.find({});
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const getUserByIdService = async (id) => {
  try {
    let result = await User.findById(id);
    return {
      message: "Lấy thông tin người dùng thành công",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
const updateUserService = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    let result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return {
      message: "Cập nhật thông tin người dùng thành công",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email }).select("+password");
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const payload = {
          id: user.id,
          email: user.email,
          role: user.role,
          username: user.username,
          class: user.class,
          grade: user.grade,
          major: user.major,
          school: user.school,
          avatar_url: user.avatar_url,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          data: {
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            class: user.class,
            grade: user.grade,
            major: user.major,
            school: user.school,
            avatar_url: user.avatar_url,
          },
        };
      } else {
        return {
          message: "Email/password không hợp lệ",
        };
      }
    } else {
      return {
        message: "Email/password không hợp lệ",
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUsersService,
  getUserByIdService,
  updateUserService,
};
