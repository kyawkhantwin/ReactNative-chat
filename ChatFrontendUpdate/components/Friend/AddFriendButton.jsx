import React, { useState } from "react";
import { Button } from "react-native-paper";
import axios from "axios";
import { URL, socket, token, userId } from "../../utilities/Config";
import { Toast } from "toastify-react-native";
import { useAppContext } from "../../utilities/useAppContext";

const AddFriendButton = ({ friendId }) => {
  const { updateUserSentFriendRequest, updateUserLists } = useAppContext();
  const [loading, setLoading] = useState(false);

  const addFriend = async () => {
    if (loading) return; 

    setLoading(true);
    const data = { requester: userId, accepter: friendId };

    try {
      const response = await axios.post(URL + "friend/add", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      Toast.success(response.data.message);
      updateUserLists(response.data.data.user);
      updateUserSentFriendRequest(response.data.data.sentFriendRequest);

      if (socket) {
        socket.emit("addFriend", { userId, friendId });
      }
    } catch (error) {
      Toast.error(error.message || "Failed to send friend request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onPress={addFriend} mode="contained" disabled={loading} loading={loading}>
      Add Friend
    </Button>
  );
};

export default AddFriendButton;
