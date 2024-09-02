import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import axios from "axios";
import { URL, socket, token, userId } from "@/utilities/Config";
import { Toast } from "toastify-react-native";

const SendMessage = ({ addContent, friendId }) => {
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessageHandler = async () => {
    if (loading || !newContent.trim()) return; // Prevent sending if loading or input is empty

    setLoading(true);
    const data = { sender: userId, receiver: friendId, content: newContent };

    try {
      const response = await axios.post(URL + "chat/send", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const resContent = response.data.data.newMessage;
      const { sender: userId, receiver: friendId, content } = resContent;

      if (socket) {
        socket.emit("latestMessage", { userId, friendId, content });
        socket.emit("message", resContent);
      }

      addContent([resContent]);
      setNewContent("");
    } catch (error) {
      Toast.error(error?.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextInput
      style={styles.textForm}
      mode="outlined"
      value={newContent}
      onChangeText={(text) => setNewContent(text)}
      label="Send Message"
      placeholder="Send Message"
      right={
        <TextInput.Icon
          icon="send"
          onPress={sendMessageHandler}
          color={loading || !newContent.trim() ? "grey" : "blue"} 
        />
      }
      editable={!loading}
    />
  );
};

const styles = StyleSheet.create({
  textForm: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
});

export default SendMessage;
