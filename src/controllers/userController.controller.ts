import * as jwt from "jsonwebtoken";
const { User } = require("@schemas/users");

async function getUser(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.id;
  const user = await User.findById({
    _id: userId,
  });
  return user;
}

async function personalInfo(req, res) {
  const user = await getUser(req);
  return res.json(user);
}

module.exports = {
  personalInfo,
};

export {};
