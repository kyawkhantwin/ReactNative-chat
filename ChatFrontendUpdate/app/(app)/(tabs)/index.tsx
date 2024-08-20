import { StyleSheet, FlatList, View, Platform } from "react-native";
import { useEffect } from "react";
import UserCard from "@/components/UserCard";
import { Text } from "react-native-paper";
import { URL, userId, token } from "@/utilities/Config";
import axios from "axios";
import { useAppContext } from "@/utilities/useAppContext";
import { Toast } from "toastify-react-native";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const Home = () => {
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
        console.log(error)
        Toast.error(error?.response?.data?.message);
      });
  };

  const renderUserCard = ({ item, index }) => {
    return (
      <UserCard user={item} title="Add" />
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <CenteredSafeAreaView>
      <Text style={styles.header}>Add Friend</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={userLists}
        renderItem={renderUserCard}
        keyExtractor={(user) => user.id}
        contentContainerStyle={Platform.OS === "web" && styles.webListContainer}
      />
    </CenteredSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },
  webListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    width: "100%",
  },
  lastInRowCard: {
    marginHorizontal: 0,
  },
});

export default Home;
