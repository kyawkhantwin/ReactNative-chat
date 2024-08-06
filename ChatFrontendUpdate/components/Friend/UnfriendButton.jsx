import React from "react";
import { Button, useTheme } from "react-native-paper";
import axios from "axios";
import { URL, token, userId } from "../../utilities/Config";
import { Toast } from "toastify-react-native";
import { useAppContext } from "@/utilities/useAppContext";

// updateFriend is from friend page
const UnfriendButton = ({ friendId }) => {
  const theme = useTheme();
  const { updateUserLists, updateFriends } = useAppContext();

  const unFriend = () => {
    const data = { removeUser: friendId, user: userId };
    axios
      .post(URL + "friend/unfriend", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        Toast.warn("Sucessfully,Unfriend User");
        console.log(data.data);
        updateUserLists(data.data.users);
        updateFriends(data.data.friends);
      })
      .catch((err) => {
        console.log(err);
        Toast.error(err?.response?.data?.message);
      });
  };

  return (
    <Button
      onPress={unFriend}
      mode="outlined"
      textColor={theme.colors.onSecondary}
      buttonColor={theme.colors.error}
    >
      Unfriend
    </Button>
  );
};

export default UnfriendButton;
