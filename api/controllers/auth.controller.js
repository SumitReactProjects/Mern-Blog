import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
// export const signup = (req, res) => {
//   console.log(req.body);
// };

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    res.send({ message: "All Feilds are Required" });
  }

  //   password hashing

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username: username,
    email,
    password: hashPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Signup Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
