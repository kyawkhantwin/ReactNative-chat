import axios from "axios";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { URL, token, userId } from "../utilities/Config";

const SendMessage =  ({ addContent, friendId }) => {
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
     
        const newContent = [data.data.newMessage];
        addContent(newContent);
        setNewContent("");
      })
      .catch((error) => {
        Toast.error(error.responser.data.message)

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
