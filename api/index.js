import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "../api/routes/user.route.js";
import authRoute from "../api/routes/auth.route.js";
import postRoute from "../api/routes/post.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongodb is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// allow you add json data
app.use(express.json());

// add cookie parser
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000 !!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
