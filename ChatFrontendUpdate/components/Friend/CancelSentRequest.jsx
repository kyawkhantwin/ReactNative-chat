import React, { useState } from 'react';
import { URL, socket, token, userId } from "../../utilities/Config";
import axios from 'axios';
import { Toast } from 'toastify-react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { useAppContext } from "../../utilities/useAppContext";

const CancelSentRequest = ({ friendId }) => {
  const { updateUserSentFriendRequest, updateUserLists } = useAppContext();
  const [loading, setLoading] = useState(false);

  const cancelRequest = async () => {
    setLoading(true);
    const data = { userId, friendId };

    try {
      const response = await axios.post(URL + "friend/user-request-cancel", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      Toast.success(response.data.message);
      if (socket) {
        socket.emit('cancelFriendReq', { userId, friendId });
      }
      updateUserLists(response.data.data.friend);
      updateUserSentFriendRequest(response.data.data.sentFriendRequest);
    } catch (err) {
      Toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onPress={cancelRequest} 
      mode="outlined" 
      disabled={loading}
      style={{ flexDirection: 'row', alignItems: 'center' }}
      loading={loading}
    >
       Cancel
    </Button>
  );
};

export default CancelSentRequest;
