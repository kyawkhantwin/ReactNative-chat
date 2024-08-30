import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Card, Text } from "react-native-paper";
import axios from "axios";
import { URL, socket, token, userId } from "../utilities/Config";
import { Toast } from "toastify-react-native";

const GetOldMessage = ({ addContent, oldContents, friendId }) => {
  const getMessage = async () => {
    const data = { sender: userId, receiver: friendId };

    return axios
      .get(URL + "chat/send", {
        params: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const contents = data.data;
        addContent(contents);
      })
      .catch((error) => {
        Toast.error(error?.responser?.data?.message || "Error Getting Message");
      });
  };

  useEffect(() => {
    socket.on("message", (data) => {
      console.log('receiver', data)
      addContent([data]);
    });
    getMessage();
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.messageContainer}
    >
      {oldContents &&
        oldContents.map((cha, i) => {
          return (
            <Card
              key={cha._id}
              style={[
                styles.message,
                cha.sender === userId ? styles.flexEnd : styles.flexStart,
              ]}
            >
              <Card.Content>
                <Text variant="bodyMedium">{cha.content}</Text>
              </Card.Content>
            </Card>
          );
        })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  messageContainer: {
    display: "flex",
    flexDirection: "column-reverse",

    marginBottom: 50,
  },
  message: {
    maxWidth: "70%",
    paddingHorizontal: 5,
    margin: 5,
  },

  flexEnd: {
    alignSelf: "flex-end",
  },
  flexStart: {
    alignSelf: "flex-start",
  },
});

export default GetOldMessage;
