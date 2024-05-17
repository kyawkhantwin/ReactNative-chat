import { StyleSheet, ScrollView, FlatList, View, Platform } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import UserCard from "../components/UserCard";
import { Text } from "react-native-paper";
import { URL, userId, token } from "../utilities/Config";
import axios from "axios";
import { useAppContext } from "../utilities/useAppContext";
import { Toast } from "toastify-react-native";

const Home = ({ navigation }) => {
  const { userLists, updateUserLists } = useAppContext();

  const fetchUsers = async () => {
    return axios
      .get(URL, {
        params: { userId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const users = data.data.user;
        updateUserLists(users);
      })
      .catch((error) => {
        Toast.error(error.responser.data.message);
      });
  };

  const renderUserCard = ({ item, index }) => {
    const isLastInRow = (index + 1) % 2 === 0;

    return (
      <UserCard
        user={item}
        title="Add"
        updateUserLists={updateUserLists}
        containerStyle={isLastInRow ? styles.lastInRowCard : null}
      />
    );
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView>
      <Text style={styles.header}>Add Friend</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={userLists}
        renderItem={renderUserCard}
        keyExtractor={(user) => user.id}

        contentContainerStyle={styles.listContainer}
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

  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
   
  },
  lastInRowCard: {
    marginHorizontal: "",
  },
});

export default Home;
