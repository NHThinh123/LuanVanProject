require("dotenv").config();
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  // Danh sách các đường dẫn không yêu cầu xác thực
  const white_lists = [
    "/users/register",
    "/users/login",
    "/courses",
    "/courses/:id",
    "/tags",
    "/tags/:id",
    "/likes/post/:post_id",
    "/like-comments/comment/:comment_id",
    "/follows/followers/:user_id",
    "/follows/following/:user_id",
    "/universities",
    "/universities/:id",
    "/posts",
    "/posts/:post_id",
    "/post-tags/post/:post_id",
    "/post-tags/tag/:tag_id",
    "/majors",
    "/majors/:id",
    "/documents/post/:post_id",
    "/documents/:document_id",
    "/comments/post/:post_id",
    "/comments/:comment_id",
    "/categories",
    "/categories/:id",
  ];

  // Hàm kiểm tra đường dẫn hiện tại với danh sách trắng
  const isWhiteListed = (url) => {
    return white_lists.some((item) => {
      if (item.includes(":")) {
        // Xử lý dynamic route
        const regex = new RegExp(`^${item.replace(/:\w+/g, "[^/]+")}$`);
        return regex.test(url);
      }
      return item === url;
    });
  };

  // Chuẩn hóa URL bằng cách loại bỏ `/api` và query params
  const normalizedUrl = req.originalUrl.split("?")[0].replace("/api", "");

  // Kiểm tra xem đường dẫn hiện tại có thuộc danh sách trắng hay không
  if (isWhiteListed(normalizedUrl)) {
    return next();
  }

  // Kiểm tra authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Không có token hoặc token không đúng định dạng",
    });
  }

  const token = authHeader.split(" ")[1];

  // Xác minh token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      bio: decoded.bio,
      full_name: decoded.full_name,
      start_year: decoded.start_year,
      major_id: decoded.major_id,
      university_id: decoded.university_id,
      avatar_url: decoded.avatar_url,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

module.exports = authentication;
