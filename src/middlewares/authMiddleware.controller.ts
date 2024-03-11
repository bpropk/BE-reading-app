import * as jwt from "jsonwebtoken";
const { UserRole } = require("../utils/enum/user");
const { User } = require("@schemas/users");

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const role = decodedToken.role;
    if (role !== UserRole.Admin) {
      return res.status(401).json({ message: "Account don't have permission" });
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      message: "Invalid Token",
    });
  }
};

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const role = decodedToken.role;

    const userId = decodedToken.id;
    const user = await User.findById({
      _id: userId,
    });

    if (role !== UserRole.User) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (!user) {
      return res.status(400).send({ message: "Invalid token" });
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      message: "Invalid Token",
    });
  }
};

module.exports = {
  adminAuth,
  userAuth,
};

export {};
