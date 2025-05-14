require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/database");
const cors = require("cors");
const authentication = require("./middleware/authentication");

const userRoutes = require("./routes/user.route");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);
app.use("/api", authentication);
app.use("/api/user/", userRoutes);
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
