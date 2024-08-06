import { View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar, Avatar } from "react-native-paper";
import SendMessage from "@/components/SendMessage";
import GetOldMessage from "@/components/GetOldMessage";
import { useNavigation, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { token, URL } from "@/utilities/Config";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const Chat = () => {
  const navigation = useNavigation();
  const { friendId } = useLocalSearchParams();
  const [friend, setFriend] = useState(null);
  const [oldContents, setOldContents] = useState([]);

  const fetchFriend = async () => {
    try {
      const response = await axios.get(URL + "friend/detail/" + friendId, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setFriend(response.data.data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };

  useEffect(() => {
    fetchFriend();
  }, [friendId]);

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
          source={require("@/assets/avatar.jpg")}
        />
        <Appbar.Content titleStyle={{ fontSize: 20 }} title={friend?.name} />
        <Appbar.Action icon="information-outline" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <CenteredSafeAreaView>
          <GetOldMessage
            oldContents={oldContents}
            addContent={addContent}
            friendId={friendId}
          />
        </CenteredSafeAreaView>
      </ScrollView>

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
