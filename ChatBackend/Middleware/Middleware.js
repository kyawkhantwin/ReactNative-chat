const jwt = require("jsonwebtoken");
const { SECRET } = require("../src/config");
const { User } = require("../Model/Model");

const Middleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = Middleware;
