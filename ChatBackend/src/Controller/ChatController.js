const { User, Chat } = require("../Model/Model");

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content, messageType } = req.body;

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = new Chat({
      sender: senderUser._id,
      receiver: receiverUser._id,
      content,
      messageType,
    });

    await newMessage.save();

    res
      .status(200)
      .json({ message: "Message sent successfully", data: { newMessage } });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Chat.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ message: "Previous Message", data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLastMessage = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Chat.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    })
    .sort({ createdAt: -1 }) 
    .limit(1); 
    res.status(200).json({ message: "Latest Message", data: messages[0] });
  } catch (error) {
    console.error("Error fetching the latest message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { sendMessage, getMessage,getLastMessage };
