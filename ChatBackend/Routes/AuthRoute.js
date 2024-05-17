const express = require("express");
const {
  Login,
  Register,
  DeleteUser,
  EditUser,
  getUser,
} = require("../Controller/UserController");
const Router = express.Router();
const upload = require("../Middleware/upload");
const Middleware = require("../Middleware/middleware");

Router.post("/login", Login);
Router.post("/register", Register);
Router.post("/delete", Middleware, DeleteUser);
Router.put("/edit", EditUser);
Router.get("/user", getUser);

module.exports = Router;
