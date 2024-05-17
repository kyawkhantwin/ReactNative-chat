import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Pressable } from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { URL, token, userId } from "../utilities/Config";
import Empty from "../components/Empty";
import { Toast } from "toastify-react-native";

const Message = ({ navigation }) => {
  const [friends, setFriends] = useState([]);

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
      <Text style={styles.header}>Message</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={friends}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() =>
                navigation.navigate("Chat", {
                  friendId: item._id,
                  friendName: item.name,
                })
              }
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
                    source={require("../assets/avatar.jpg")}
                  />
                )}
                right={(props) => <View style={styles.active}></View>}
                title={item.name}
                subtitle="Hi Bro!"
              />
              <Divider />
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty text="Add Friend To Message" />}
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
  active: {
    marginRight: 10,
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "green",
  },
});

export default Message;
