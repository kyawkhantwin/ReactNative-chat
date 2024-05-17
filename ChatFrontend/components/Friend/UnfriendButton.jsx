import React from "react";
import { Button, useTheme } from "react-native-paper";
import axios from "axios";
import { URL, token, userId } from "../../utilities/Config";
import { Toast } from "toastify-react-native";

const UnfriendButton = ({ friendId, updateFriend, updateUserLists }) => {
  const theme = useTheme();

  const unFriend = () => {
    const data = { removeUser: friendId, user: userId };
    axios
      .post(URL + "friend/unfriend", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        Toast.success(data);
        updateUserLists(data.data.users);
        updateFriend(data.data.friends);
      })
      .catch((err) => Toast.error(err.response.data.message));
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
