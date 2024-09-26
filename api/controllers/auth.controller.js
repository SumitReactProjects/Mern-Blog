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

    // Now User authentication(Generate token)

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Remove password from Details
    const { password: pass, ...rest } = validUser._doc;

    // Now Create Response

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Creating Google Auth for Backend
export const google = async (req, res, next) => {
  // Getting Data from body
  const { email, name, googlePhotoUrl } = req.body;

  try {
    // Checking the user exits in database or not
    const user = await User.findOne({ email });
    // if User exist
    if (user) {
      //creating a token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      // remove the password feild from user doc
      const { password, ...rest } = user._doc;
      // Sending a ok response with token
      res
        .status(200)
        .cookie("access-token", token, { httpOnly: true })
        .json(rest);
    } else {
      // If the user is not exists
      // then will generate random password for user with google auth
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // After Generating password password should be hashed

      const hashPassword = bcryptjs.hashSync(generatePassword, 10);

      // After hashing the password will create an new User

      const newUser = new User({
        username:
          name.toLowerCase().split("").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profilePhoto: googlePhotoUrl,
      });

      //then user will save in databae

      await newUser.save();

      // and Generate a token

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      // and remove the password from newly created user

      const { password, ...rest } = newUser._doc;

      // Send Ok response

      res
        .status(200)
        .cookie("access-token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    // in case of error
    next(error);
  }
};
