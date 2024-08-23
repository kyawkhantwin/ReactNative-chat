const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String, default: "Hi! I am new to here" },
    online: { type: Boolean, default: false },
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Chat Schema
const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    readByReceiver: { type: Boolean, default: false },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

// // Group Chat Schema
// const groupChatSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     messages: [chatSchema],
//     admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { timestamps: true }
// );

// const GroupChat = mongoose.model("GroupChat", groupChatSchema);

module.exports = { User, Chat };
