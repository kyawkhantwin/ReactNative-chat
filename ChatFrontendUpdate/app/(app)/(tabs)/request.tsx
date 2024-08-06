import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Platform } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";
import { useAppContext } from "@/utilities/useAppContext";
import { URL, token, userId } from "@/utilities/Config";
import UserCard from "@/components/UserCard";
import Empty from "@/components/Empty";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const RequestFriend = () => {
  const {
    updateUserSentFriendRequest,
    userSentFriendRequest,
  } = useAppContext();

  const [friendRequests, setFriendRequests] = useState([]);

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
      await Promise.all([fetchFriendsRequest(), fetchSentFriendsRequest()]);
    };

    fetchAllData();
  }, []);

  return (
    <CenteredSafeAreaView>
      <Text style={styles.header}>Friend Requests</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Platform.OS === "web" && styles.webListContainer}
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
      />

      <Text style={styles.header}>Your Friend Requests</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Platform.OS === "web" && styles.webListContainer}
        data={userSentFriendRequest}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            title="SentRequest"
          />
        )}
        keyExtractor={(user) => user._id.toString()}
        ListEmptyComponent={() => (
          <Empty text="Added Friends will appear here" />
        )}
      />
    </CenteredSafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },
  webListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
});

export default RequestFriend;
