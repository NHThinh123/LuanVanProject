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
const userChatRoomRoutes = require("./routes/user_chat_room.route");
const universityRoutes = require("./routes/university.route");
const postTagRoutes = require("./routes/post_tag.route");
const messageRoutes = require("./routes/message.route");
const majorRoutes = require("./routes/major.route");
const tagRoutes = require("./routes/tag.route");
const chatRoomRoutes = require("./routes/chat_room.route");
const categoryRoutes = require("./routes/category.route");

//const documentRoutes = require("./routes/document.route");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/like-posts", userLikePostRoutes);
app.use("/api/like-comments", userLikeCommentRoutes);
app.use("/api/interest-courses", userInterestCourseRoutes);
app.use("/api/follows", userFollowRoutes);
app.use("/api/chat-rooms", userChatRoomRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/post-tags", postTagRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/majors", majorRoutes);
//app.use("/api/documents", documentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chat-rooms", chatRoomRoutes);
app.use("/api/categories", categoryRoutes);

(async () => {
  try {
    await connection();
    try {
      await axios.post("http://localhost:8000/train/surprise");
      console.log("Surprise model trained successfully on server startup");
    } catch (error) {
      console.error("Error training Surprise model on server startup:");
    }

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
