import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// export const signup = (req, res) => {
//   console.log(req.body);
// };

export const signup = async (req, res, next) => {
  // Sending Data from ui
  const { username, email, password } = req.body;

  // Check the feilds is empty
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All Feilds are Required"));
  }

  //   password hashing

  const hashPassword = bcryptjs.hashSync(password, 10);

  // Creating New User with hash password

  const newUser = new User({
    username: username,
    email,
    password: hashPassword,
  });

  // After Creating User saving the User to Data base

  try {
    await newUser.save();
    res.json({ message: "Signup Successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  // Get email and password from request body
  const { email, password } = req.body;

  // Checking email and password feild

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All Feilds are Required"));
  }

  // Find email and password from data base

  try {
    // Find Email(User) Fro Data base
    const validUser = await User.findOne({ email });

    // Check user is valid or not
    if (!validUser) {
      return next(errorHandler(404, "User not Found!!!"));
    }

    // Now Compare two Password

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    // Now check the password is Valid or not

    if (!validPassword) {
      return next(errorHandler(404, "Invalid Password"));
    }

    // Remove password from Details
    const { password: pass, ...rest } = validUser._doc;

    // Now User authentication(Generate token)

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Now Create Response

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
