import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Platform, FlatList } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useAppContext } from "@/utilities/useAppContext";
import { URL, socket, token, userId } from "@/utilities/Config";
import UserCard from "@/components/UserCard";
import Empty from "@/components/Empty";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const RequestFriend = () => {
  const { updateUserSentFriendRequest, userSentFriendRequest } = useAppContext();
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.on("addFriend", (data) => {
        setFriendRequests((prev) => [...prev, data]);
      });

      socket.on("acceptFriend", (data) => {
        updateUserSentFriendRequest((prev) =>
          prev.filter((prev) => prev._id !== data._id)
        );
      });
    }
    return () => {
      if (socket) {
        socket.off("addFriend");
        socket.off("acceptFriend");
      }
    };
  }, [socket]);

  const fetchFriendsRequest = async () => {
    try {
      const response = await axios.get(URL + "friend/request", {
        params: { userId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const { friendRequests } = response.data.data;
      setFriendRequests(friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const fetchSentFriendsRequest = async () => {
    try {
      const response = await axios.get(URL + "friend/user-request", {
        params: { userId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const { userRequest } = response.data.data;
      updateUserSentFriendRequest(userRequest);
    } catch (error) {
      console.error("Error fetching sent friend requests:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchFriendsRequest(), fetchSentFriendsRequest()]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <CenteredSafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" animating={true} />
      </CenteredSafeAreaView>
    );
  }

  return (
    <CenteredSafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Friend Requests</Text>
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={friendRequests}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                title="Request"
                updateFriendRequests={setFriendRequests}
              />
            )}
            keyExtractor={(user) => user._id.toString()}
            ListEmptyComponent={() => (
              <Empty text="Friend Requests will appear here" />
            )}
            contentContainerStyle={Platform.OS === "web" && styles.webListContainer}
          />
        </View>

        <Text style={styles.header}>Your Friend Requests</Text>
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={userSentFriendRequest}
            renderItem={({ item }) => (
              <UserCard user={item} title="SentRequest" />
            )}
            keyExtractor={(user) => user._id.toString()}
            ListEmptyComponent={() => (
              <Empty text="Added Friends will appear here" />
            )}
            contentContainerStyle={Platform.OS === "web" && styles.webListContainer}
          />
        </View>
      </ScrollView>
    </CenteredSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure container takes up full space
  },
  scrollViewContent: {
    flexGrow: 1, // Ensure ScrollView content takes up full space
  },
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },
  listContainer: {
    marginBottom: 20, // Space between lists
  },
  webListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RequestFriend;
