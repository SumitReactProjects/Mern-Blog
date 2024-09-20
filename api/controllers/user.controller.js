export const test = (req, res) => {
  res.send({ message: "Api Connected" });
};

export const updateUser = async (req, res, next) => {
  console.log(req.user);
};
