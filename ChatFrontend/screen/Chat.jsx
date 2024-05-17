import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  Avatar,
} from "react-native-paper";
import SendMessage from "../components/SendMessage";
import GetOldMessage from "../components/GetOldMessage";


const Chat = ({ navigation, route }) => {
  const { friendId ,friendName} = route.params;
  const [oldContents, setOldContents] = useState([]);
  const addContent = (content) => {
    setOldContents((prev) => [...prev, ...content]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Image
          size={50}
          style={{ marginRight: 10 }}
          source={require("../assets/avatar.jpg")}
        />

        <Appbar.Content titleStyle={{ fontSize: 20 }} title={friendName} />
        <Appbar.Action icon="information-outline" onPress={() => {}} />
      </Appbar.Header>
      <GetOldMessage
        oldContents={oldContents}
        addContent={addContent}
        friendId={friendId}
      />
      <SendMessage addContent={addContent} friendId={friendId} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
});

export default Chat;
