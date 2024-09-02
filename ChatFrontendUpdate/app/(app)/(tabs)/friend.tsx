import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, ActivityIndicator } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import { URL, socket, token, userId } from "@/utilities/Config";
import UserCard from "@/components/UserCard";
import Empty from "@/components/Empty";
import { Toast } from "toastify-react-native";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";
import { useAppContext } from "@/utilities/useAppContext";

const Friend = () => {
  const { friends, updateFriends } = useAppContext();
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(URL + "friend", {
        params: { userId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const friends = data.data.friends;
      updateFriends(friends);
    } catch (error) {
      Toast.error(
        error?.response?.data?.message ||
          "Internal Server Error: Cannot Fetch Friend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{

    const handleAcceptFriend = (data)=>{
      updateFriends((prev) => [...prev,data])
    }
    const handleUnFriend = (data)=>{
      updateFriends((prev) => prev.filter(prev => prev._id !== data._id))
    }
   


    if(socket){
      socket.on('acceptFriend',handleAcceptFriend)
      socket.on('unFriend',handleUnFriend)
    }

    return ()=>{
      socket.off('acceptFriend',handleAcceptFriend)
      socket.off('unFriend',handleUnFriend)

    }
  },[socket])

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
      <Text style={styles.header}>Friend</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 25 }}
        data={friends}
        renderItem={({ item }) => <UserCard user={item} title="Friend" />}
        keyExtractor={(user) => user._id}
        ListEmptyComponent={
          <Empty text="Your Friend Will Appear Here! Add More Friends" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default Friend;
