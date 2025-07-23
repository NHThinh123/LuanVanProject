require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/database");
const cors = require("cors");
const axios = require("axios");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");
const courseRoutes = require("./routes/course.route");
const searchHistoryRoutes = require("./routes/search_history.route");
const userLikePostRoutes = require("./routes/user_like_post.route");
const userLikeCommentRoutes = require("./routes/user_like_comment.route");
const userInterestCourseRoutes = require("./routes/user_interest_course.route");
const userFollowRoutes = require("./routes/user_follow.route");
const universityRoutes = require("./routes/university.route");
const postTagRoutes = require("./routes/post_tag.route");
const messageRoutes = require("./routes/message.route");
const majorRoutes = require("./routes/major.route");
const tagRoutes = require("./routes/tag.route");
const chatRoomRoutes = require("./routes/chat_room.route");
const categoryRoutes = require("./routes/category.route");
const { Server } = require("socket.io");
const Message = require("./models/message.model");

const app = express();
const port = process.env.PORT || 8888;

// Cấu hình CORS cho phép nhiều nguồn gốc
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], // Thêm 5173
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

// Các route hiện có
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/like-posts", userLikePostRoutes);
app.use("/api/like-comments", userLikeCommentRoutes);
app.use("/api/interest-courses", userInterestCourseRoutes);
app.use("/api/follows", userFollowRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/post-tags", postTagRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/majors", majorRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chat-rooms", chatRoomRoutes);
app.use("/api/categories", categoryRoutes);

// Tạo HTTP server và tích hợp Socket.IO
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions, // Sử dụng cùng cấu hình CORS
});

// Xử lý kết nối Socket.IO
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (chat_room_id) => {
    socket.join(chat_room_id);
    console.log(`User ${socket.id} joined room ${chat_room_id}`);
  });

  socket.on("send_message", async (data) => {
    const { chat_room_id, content, user_id } = data;
    try {
      const message = await Message.create({
        user_send_id: user_id,
        chat_room_id,
        content,
        read_by: [user_id],
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("user_send_id", "full_name avatar_url")
        .select("user_send_id content createdAt read_by");

      io.to(chat_room_id).emit("receive_message", populatedMessage);

      const Chat_Room = require("./models/chat_room.model");
      await Chat_Room.findByIdAndUpdate(chat_room_id, {
        last_message_id: message._id,
      });
    } catch (error) {
      console.error("Error sending message via Socket.IO:", error);
    }
  });

  socket.on("mark_as_read", async ({ chat_room_id, user_id }) => {
    try {
      await Message.updateMany(
        { chat_room_id, read_by: { $ne: user_id } },
        { $addToSet: { read_by: user_id } }
      );
      io.to(chat_room_id).emit("messages_read", { chat_room_id, user_id });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

(async () => {
  try {
    await connection();
    try {
      await axios.post("http://localhost:8000/train/surprise");
      console.log("Surprise model trained successfully on server startup");
    } catch (error) {
      console.error("Error training Surprise model on server startup:");
    }

    server.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
