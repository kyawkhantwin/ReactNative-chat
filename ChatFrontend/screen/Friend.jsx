import React, { useEffect, useState } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { useAppContext } from "../utilities/useAppContext";
import { FlatList, StyleSheet } from "react-native";
import { URL, token, userId } from "../utilities/Config";
import UserCard from "../components/UserCard";
import Empty from "../components/Empty";

const Friend = () => {
  const { updateUserLists } = useAppContext();

  const [friends, setFriends] = useState([]);
  const updateFriend = (friend) => {
    setFriends(friend);
  };

  const fetchFriends = async () => {
    return axios
      .get(URL + "friend", {
        params: { userId },

        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const friends = data.data.friends;

        setFriends(friends);
      })
      .catch((error) => {
        Toast.error(error.responser.data.message);
      });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <SafeAreaView>
      <Text style={styles.header}>Friend Request</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={friends}
        renderItem={({ item }) => {
          return (
            <UserCard
              user={item}
              title="Friend"
              updateFriend={updateFriend}
              updateUserLists={updateUserLists}
            />
          );
        }}
        keyExtractor={(user) => user.id}
        ListEmptyComponent={<Empty text="Friend Will appear here" />}
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
export default Friend;
