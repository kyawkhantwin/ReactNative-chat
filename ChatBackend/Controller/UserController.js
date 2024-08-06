const bcrypt = require("bcrypt");
const { User } = require("../Model/Model");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../src/config");

const createToken = (user) => {
  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    SECRET,
    { expiresIn: "70h" }
  );
};

const Register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill out all required fields.",
      });
    }

    const nameExists = await User.findOne({ name });
    if (nameExists) {
      return res.status(409).json({
        message: "Username already exists.",
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = createToken(newUser);

    return res.status(201).json({
      message: "User created successfully.",
      data: { token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const Login = async (req, res) => {
  const { nameOrEmail, password } = req.body;

  try {
    if (!nameOrEmail || !password) {
      return res.status(400).json({
        message: "Please provide both username/email and password.",
      });
    }

    let user = await User.findOne({
      $or: [{ name: nameOrEmail }, { email: nameOrEmail }],
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid Password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      data: { token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const DeleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const EditUser = async (req, res) => {
  const { userId, avatar } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    user.avatar = avatar;

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, avatar, bio } = user;

    return res.status(200).json({
      data: { user: { name, email, avatar, bio } },
      message: "User Data",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Register, Login, DeleteUser, EditUser, getUser };
