const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Bạn không đủ quyền hạn để truy cập đường dẫn này" });
  }
};

module.exports = isAdmin;
