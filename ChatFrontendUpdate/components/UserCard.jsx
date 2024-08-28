import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import CardButton from "./CardButton";

const UserCard = ({
  user,
  title,
  updateFriendRequests,
}) => {
  return (
    <Card
      style={[
        styles.cardContainer,
        Platform.OS === "web" && styles.webCardContainer,
      ]}
      onPress={() => {}}
    >
      <Card.Title
        titleVariant="titleLarge"
        titleStyle={{ fontWeight: "bold" }}
        leftStyle={{ marginRight: 20 }}
        left={(props) => (
           <Avatar.Image
           {...props}
           size={50}
           source={
             user?.avatar
               ? { uri: user.avatar }
               : require("@/assets/avatar.jpg")
           }
         />
        )}
        title={user.name}
        subtitle={user.bio}
      />

      <Card.Actions>
        <CardButton
          title={title}
          friendId={user._id}
          updateFriendRequests={updateFriendRequests}
        />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 7,
    paddingVertical: 5,
  },
  webCardContainer: {
    width: "500px",
  },
});

export default UserCard;
