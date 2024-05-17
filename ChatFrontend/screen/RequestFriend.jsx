import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import axios from "axios";
import { useAppContext } from "../utilities/useAppContext";
import { URL, token, userId } from "../utilities/Config";
import UserCard from "../components/UserCard";
import Empty from "../components/Empty"; // Assuming you have an Empty component

const RequestFriend = () => {
  const {
    updateUserSentFriendRequest,
    userSentFriendRequest,
    updateUserLists,
  } = useAppContext();

  const [friendRequests, setFriendRequests] = useState([]);

  const updateFriendRequests = (friendRequest) => {
    setFriendRequests(friendRequest);
  };

  const fetchFriendsRequest = async () => {
    try {
      const response = await axios.get(URL + "friend/request", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
        },
      });
      const { userRequest } = response.data.data;
      updateUserSentFriendRequest(userRequest);
    } catch (error) {
      console.error("Error fetching sent friend requests:", error);
    }
  };

  useEffect(() => {
    fetchFriendsRequest();
    fetchSentFriendsRequest();
  }, []);

  return (
    <SafeAreaView>
      <Text style={styles.header}>Friend Requests</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={friendRequests}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            title="Request"
            updateFriendRequests={updateFriendRequests}
          />
        )}
        keyExtractor={(user) => user._id.toString()}
        ListEmptyComponent={() => (
          <Empty text="Friend Requests will appear here" />
        )}
        columnWrapperStyle={{ marginHorizontal: "auto" }}
        numColumns={2}
      />

      <Text style={styles.header}>Your Friend Requests</Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 25 }}
          data={userSentFriendRequest}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              title="SentRequest"
              updateUserLists={updateUserLists}
            />
          )}
          keyExtractor={(user) => user._id.toString()}
          ListEmptyComponent={() => (
            <Empty text="Added Friend Will appear here" />
          )}
          columnWrapperStyle={{ marginHorizontal: "auto" }}
          numColumns={2}
        />
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },

});

export default RequestFriend;
