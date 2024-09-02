const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("node:path");
const AuthRoute = require("./Routes/AuthRoute");
const ChatRoute = require("./Routes/ChatRoute");
const FriendRoute = require("./Routes/FriendRoute");
const { showPeople } = require("./Controller/FriendController");
const { User } = require("./Model/Model");
require('dotenv').config();



const app = express();
const server = http.createServer(app);

app.use(
  cors()
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use("/", AuthRoute);
app.use("/chat", ChatRoute);
app.use("/friend", FriendRoute);
app.get("/", showPeople);
app.use("/img", express.static(path.join("src", "avatar")));





mongoose
  .connect(process.env.mongoDBUrl)
  .then(() => {
    server.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  const users = {};

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {

      if (userId) {
        users[userId] = socket.id;
        io.emit("onlineUsers", Object.keys(users));
      }
    });

    socket.on('acceptFriend',async (data) =>{
      const receiverSocketId = users[data.friendId];
      const acceptFriend = await User.findById(data.userId)

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("acceptFriend", acceptFriend); 
      }
    })

    socket.on('unFriend',async (data) =>{
      const receiverSocketId = users[data.friendId];
      const unFriendUser = await User.findById(data.userId)

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("unFriend", unFriendUser); 
      }
    })

    socket.on('addFriend',async (data) =>{
      const receiverSocketId = users[data.friendId];
      const addedUser = await User.findById(data.userId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("addFriend", addedUser); 
      }
    })

    socket.on('cancelFriendReq',async (data) =>{
      const receiverSocketId = users[data.friendId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("cancelFriendReq", cancelUser); 
      }
    })
  
    socket.on("message", (data) => {
      const { receiver } = data;
      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", data); 
      }
    });

    socket.on("latestMessage", (data) => {
      const { userId, friendId, content } = data;
      if (!userId || !friendId || !content) {
        console.error("Invalid message data:", data);
        return;
      }
    
      const friendSocketId = users[friendId];
      const userSocketId = users[userId];
    
      if (friendSocketId) {
        io.to(friendSocketId).emit("latestMessage", { id: userId, content });
      } else {
        console.warn(`No socket found for friendId: ${friendId}`);
      }
    
      if (userSocketId) {
        io.to(userSocketId).emit("latestMessage", { id: friendId, content });
      } else {
        console.warn(`No socket found for userId: ${userId}`);
      }
    });
    
  
    socket.on("disconnect", () => {
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          io.emit("onlineUsers", Object.keys(users));
          break;
        }
      }
    });
  });
  
