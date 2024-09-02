import React, { useState } from "react";
import { Button, useTheme } from "react-native-paper";
import axios from "axios";
import { URL, socket, token, userId } from "../../utilities/Config";
import { Toast } from "toastify-react-native";
import { useAppContext } from "@/utilities/useAppContext";

const UnfriendButton = ({ friendId }) => {
  const theme = useTheme();
  const { updateUserLists, updateFriends } = useAppContext();
  const [loading, setLoading] = useState(false);

  const unFriend = async () => {
    if (loading) return; 
    setLoading(true);
    const data = { removeUser: friendId, user: userId };

    try {
      const response = await axios.post(URL + "friend/unfriend", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      Toast.warn("Successfully unfriended user");
      if (socket) {
        socket.emit("unFriend", { userId, friendId });
      }
      updateUserLists(response.data.data.users);
      updateFriends(response.data.data.friends);
    } catch (error) {
      console.log(error);
      Toast.error(error?.response?.data?.message || "Failed to unfriend user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={unFriend}
      mode="outlined"
      textColor={theme.colors.onSecondary}
      buttonColor={theme.colors.error}
      disabled={loading}
      loading={loading}
    >
      Unfriend
    </Button>
  );
};

export default UnfriendButton;
