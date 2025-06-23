require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const createUserService = async (
  email,

  password,
  role,
  university_id,
  major_id,
  full_name,
  start_year,
  avatar_url
) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        message: "Email đã tồn tại",
      };
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let result = await User.create({
      email,

      password: hashedPassword,
      role: role || "user",
      university_id,
      major_id,
      full_name: full_name || "",
      start_year: start_year || 2025,
      avatar_url:
        avatar_url ||
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
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
    let result = await User.find({})
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserByIdService = async (id) => {
  try {
    let result = await User.findById(id)
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!result) {
      return {
        message: "Người dùng không tồn tại",
      };
    }
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
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    let result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("university_id", "university_name")
      .populate("major_id", "major_name");
    if (!result) {
      return {
        message: "Người dùng không tồn tại",
      };
    }

    // Tạo token mới với thông tin cập nhật
    const payload = {
      id: result._id,
      email: result.email,
      role: result.role,
      username: result.username,
      full_name: result.full_name,
      start_year: result.start_year,
      major_id: result.major_id,
      university_id: result.university_id,
      avatar_url: result.avatar_url,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      message: "Cập nhật thông tin người dùng thành công",
      data: result,
      access_token, // Trả về token mới
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const payload = {
          id: user._id,
          email: user.email,
          role: user.role,

          full_name: user.full_name,
          start_year: user.start_year,
          major_id: user.major_id,
          university_id: user.university_id,
          avatar_url: user.avatar_url,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          data: {
            id: user._id,
            email: user.email,
            role: user.role,

            full_name: user.full_name,
            start_year: user.start_year,
            major_id: user.major_id,
            university_id: user.university_id,
            avatar_url: user.avatar_url,
          },
        };
      } else {
        return {
          message: "Email hoặc mật khẩu không hợp lệ",
        };
      }
    } else {
      return {
        message: "Email hoặc mật khẩu không hợp lệ",
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
