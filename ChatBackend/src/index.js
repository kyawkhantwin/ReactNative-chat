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
require('dotenv').config();



const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
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

const users = {};

mongoose
  .connect(process.env.mongoDBUrl)
  .then(() => {
    server.listen(3333, () => {
      console.log("Server is listening on port 3333");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

io.on("connection", (socket) => {

  socket.on("register", (userId) => {
    if (userId) {
      users[userId] = socket.id;
      io.emit("onlineUsers", Object.keys(users));
    }
  });

  socket.on("message", (data) => {
    const { receiver } = data;
    const receiverSocketId = users[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", data);
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
