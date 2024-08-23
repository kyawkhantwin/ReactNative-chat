const express = require("express");
const {
  getFriend,
  AddFriend,
  AcceptFriend,
  RemoveFriend,
  showFriends,
  showFriendRequests,
  showUserSentRequest,
  cancelUserSentRequest,
} = require("../Controller/FriendController");
const Middleware = require("../Middleware/Middleware");
const Router = express.Router();
Router.use(Middleware);

Router.get("/", showFriends);
Router.get("/detail/:friendId", getFriend);
Router.get("/request", showFriendRequests);
Router.get("/user-request", showUserSentRequest);
Router.get("/user-request", (req, res) => {
  const { userId } = req.query;
  console.log(userId);
});
Router.post("/user-request-cancel", cancelUserSentRequest);

// friend adding
Router.post("/add", AddFriend);
Router.post("/accept", AcceptFriend);
Router.post("/unfriend", RemoveFriend);

module.exports = Router;
