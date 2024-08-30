import { useEffect, useState } from "react";
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
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.on("onlineUsers", (users) => {
        console.log('online',users)
        setActiveUsers(users);
      });
    }
  }, []);

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
        error?.response?.data?.message ||
          "Internal Server Error: Cannot Fetch Messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

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
                  right={(props) => (
                    <View
                      style={isActive ? styles.online : styles.offline}
                    ></View>
                  )}
                  title={item.name}
                  subtitle="Hi Bro!"
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
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default Message;
