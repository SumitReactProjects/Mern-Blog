import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "../api/routes/user.route.js";
import authRoute from "../api/routes/auth.route.js";

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

app.listen(3000, () => {
  console.log("Server is running on port 3000 !!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRoute);
