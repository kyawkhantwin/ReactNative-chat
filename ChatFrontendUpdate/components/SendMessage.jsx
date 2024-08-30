import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { URL, socket, token, userId } from "@/utilities/Config";
import { Toast } from "toastify-react-native";

const SendMessage = ({ addContent, friendId }) => {
  const [newContent, setNewContent] = useState();

  const sendMessageHandler = async () => {
    const data = { sender: userId, receiver: friendId, content: newContent };

    return axios
      .post(URL + "chat/send", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const resContent = data.data.newMessage;
        socket.emit("message", resContent);
        console.log('sender',resContent)

        addContent([resContent]);
        setNewContent("");
      })
      .catch((error) => {
        Toast.error(error?.response?.data?.message);
      });
  };
  return (
    <TextInput
      style={styles.textForm}
      mode="outlined"
      value={newContent}
      onChangeText={(text) => setNewContent(text)}
      label="Send Message"
      placeholder="Send Message"
      right={<TextInput.Icon icon="send" onPress={sendMessageHandler} />}
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
