const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const AuthRoute = require("./Routes/AuthRoute");
const ChatRoute = require("./Routes/ChatRoute");
const FriendRoute = require("./Routes/FriendRoute");
const { mongoDBUrl } = require("./src/config");
const path = require("node:path");
const { showPeople } = require("./Controller/FriendController");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use("/", AuthRoute);
app.use("/chat", ChatRoute);
app.use("/friend", FriendRoute);
app.get("/", showPeople)
app.use("/img", express.static(path.join("src", "avatar")));



io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    console.log("Message:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

mongoose
  .connect(mongoDBUrl)
  .then(() => {
    app.listen("3333", () => {
      console.log("app is listening at 3333");
    });
  })
  .catch((err) => {
    console.log(err);
  });
