import { View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Appbar, Avatar, ActivityIndicator } from "react-native-paper";
import SendMessage from "@/components/SendMessage";
import GetOldMessage from "@/components/GetOldMessage";
import {  useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { token, URL } from "@/utilities/Config";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const Chat = () => {
  const { friendId } = useLocalSearchParams();
  const [friend, setFriend] = useState(null);
  const [oldContents, setOldContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for the ScrollView

  const fetchFriend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL + "friend/detail/" + friendId, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setFriend(response.data.data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriend();
  }, [friendId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [oldContents]);

  const addContent = (content) => {
    setOldContents((prev) => [...prev, ...content]);
  };

  if (loading) {
    return (
      <CenteredSafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" animating={true} />
      </CenteredSafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.push('/message')} />
        <Avatar.Image
          size={50}
          style={{ marginRight: 10 }}
          source={require("@/assets/avatar.jpg")}
        />
        <Appbar.Content titleStyle={{ fontSize: 20 }} title={friend?.name} />
        <Appbar.Action icon="information-outline" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView
      
        ref={scrollViewRef}
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <CenteredSafeAreaView style={{marginBottom: 40,}}>
          <GetOldMessage
            oldContents={oldContents}
            addContent={addContent}
            friendId={friendId}
          />
        </CenteredSafeAreaView>
      </ScrollView>

      <SendMessage addContent={addContent} friendId={friendId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default Chat;
