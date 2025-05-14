require("dotenv").config();
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  // Danh sách các đường dẫn không yêu cầu xác thực
  const white_lists = [
    "/user/login",
    "/user/register",
    "/topic",
    "/comment",
    "/topic/:id",
  ];

  // Hàm kiểm tra đường dẫn hiện tại với danh sách trắng
  const isWhiteListed = (url) => {
    return white_lists.some((item) => {
      if (item.includes(":")) {
        // Xử lý dynamic route
        const regex = new RegExp(
          `^${item.replace(/:\w+/g, "[^/]+")}$` // Thay :param bằng regex
        );
        return regex.test(url);
      }
      return item === url;
    });
  };

  // Kiểm tra xem đường dẫn hiện tại có thuộc danh sách trắng hay không
  if (isWhiteListed(req.originalUrl.split("?")[0].replace("/api", ""))) {
    next();
  } else {
    // Kiểm tra authorization header
    if (req?.headers?.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      // Xác minh token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        };
        console.log(decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token không hợp lệ hoặc hết hạn",
        });
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
};

module.exports = authentication;
