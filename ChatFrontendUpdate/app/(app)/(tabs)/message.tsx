import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Pressable } from "react-native";
import { Avatar, Card, Text, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { URL, socket, token, userId } from "@/utilities/Config";
import Empty from "@/components/Empty";
import { Toast } from "toastify-react-native";
import { router } from "expo-router";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const Message = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestMessages, setLatestMessages] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);

  // Fetch Friends and Latest Messages
  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(URL + "friend", {
        params: { userId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setFriends(data.data.friends);
    } catch (error) {
      Toast.error(
        error?.response?.data?.message || "Internal Server Error: Cannot Fetch Friend"
      );
    } finally {
      setLoading(false);
    }
  };

  const getLatestMessages = async (friendsList) => {
    if (!friendsList.length) return;
    try {
      const requests = friendsList.map((friend) =>
        axios
          .get(URL + "chat/latest", {
            params: { sender: userId, receiver: friend._id },
            headers: { authorization: `Bearer ${token}` },
          })
          .then(({ data }) => ({
            friendId: friend._id,
            message: data.data.content,
          }))
      );

      const messages = await Promise.all(requests);
      const messagesMap = messages.reduce((acc, { friendId, message }) => {
        acc[friendId] = message;
        return acc;
      }, {});

      setLatestMessages(messagesMap);
    } catch (error) {
      Toast.error(error?.response?.data?.message || "Error Getting Messages");
    }
  };

  useEffect(() => {
    fetchFriends();

    const handleAcceptFriend = (data) => {
      setFriends((prev) => [...prev, data]);
    };

    const handleLatestMessage = ({ id, content }) => {
      setLatestMessages((prev) => ({ ...prev, [id]: content }));
    };

    const handleOnlineUsers = (users) => {
      setActiveUsers(users);
    };

    if (socket) {
      socket.on("acceptFriend", handleAcceptFriend);
      socket.on("latestMessage", handleLatestMessage);
      socket.on("onlineUsers", handleOnlineUsers);
    }

    return () => {
      if (socket) {
        socket.off("acceptFriend", handleAcceptFriend);
        socket.off("latestMessage", handleLatestMessage);
        socket.off("onlineUsers", handleOnlineUsers);
      }
    };
  }, [socket]);

  useEffect(() => {
    getLatestMessages(friends);
  }, [friends]);

  if (loading) {
    return (
      <CenteredSafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" animating={true} />
      </CenteredSafeAreaView>
    );
  }

  return (
    <CenteredSafeAreaView>
      <Text style={styles.header}>Message</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={friends}
        renderItem={({ item }) => {
          const isActive = activeUsers.includes(item._id);
          return (
            <Pressable onPress={() => router.push("/chat/" + item._id)}>
              <Card
                style={{
                  width: 380,
                  marginBottom: 10,
                  marginHorizontal: "auto",
                }}
              >
                <Card.Title
                  titleVariant="titleLarge"
                  titleStyle={{ fontWeight: "bold" }}
                  subtitleStyle={{ color: "gray" }}
                  leftStyle={{ marginRight: 20 }}
                  left={(props) => (
                    <Avatar.Image
                      {...props}
                      size={50}
                      source={
                        item?.avatar
                          ? { uri: item.avatar }
                          : require("@/assets/avatar.jpg")
                      }
                    />
                  )}
                  right={() => (
                    <View style={isActive ? styles.online : styles.offline} />
                  )}
                  title={item.name}
                  subtitle={latestMessages[item._id] || "No messages"}
                />
              </Card>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Empty text="Add Friend To Message" />}
      />
    </CenteredSafeAreaView>
  );
};

const circle = {
  marginRight: 10,
  width: 10,
  height: 10,
  borderRadius: 50,
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },
  online: {
    ...circle,
    backgroundColor: "green",
  },
  offline: {
    ...circle,
    backgroundColor: "grey",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default Message;
