import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.send({ message: "Api Connected" });
};

export const updateUser = async (req, res, next) => {
  // console.log(req.user);

  if (req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to update user"));
  }

  // Password Feild
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must atleast 6 Characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must between 6 to 20 Characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username does not contain space"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username has lower case Characters"));
    }
    if (req.body.username.match(/^a-zA-Z+$/)) {
      return next(
        errorHandler(400, "Username only Contains numbers and Letters")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePhoto: req.body.profilePhoto,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete the user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access-token")
      .status(200)
      .json("User Signout Successfully");
  } catch (error) {
    next(error);
  }
};
