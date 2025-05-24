require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/database");
const cors = require("cors");
const authentication = require("./middleware/authentication");

const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");
const searchHistoryRoutes = require("./routes/searchHistory.route");
const subjectRoutes = require("./routes/subject.route");
const tagRoutes = require("./routes/tag.route");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);
app.use("/api", authentication);
app.use("/api/users/", userRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tags", tagRoutes);

(async () => {
  try {
    await connection();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
