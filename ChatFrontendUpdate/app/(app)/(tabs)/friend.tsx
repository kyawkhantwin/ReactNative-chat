import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text } from "react-native-paper";
import { useAppContext } from "@/utilities/useAppContext";
import { FlatList, StyleSheet } from "react-native";
import { URL, token, userId } from "@/utilities/Config";
import UserCard from "@/components/UserCard";
import Empty from "@/components/Empty";
import { Toast } from "toastify-react-native";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const Friend = () => {
  const { friends, updateFriends } = useAppContext();

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

        updateFriends(friends);
      })
      .catch((error) => {
        Toast.error(
          error?.response?.data?.message ||
            "Internal Server Error: Cannot Fetch Friend"
        );
      });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <CenteredSafeAreaView>
      <Text style={styles.header}>Friend </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={friends}
        renderItem={({ item }) => {
          return (
            <UserCard user={item} title="Friend"  />
          );
        }}
        keyExtractor={(user) => user._id}
        ListEmptyComponent={
          <Empty text="Your Friend Will Appear Here!Add More Friends" />
        }
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
});
export default Friend;
