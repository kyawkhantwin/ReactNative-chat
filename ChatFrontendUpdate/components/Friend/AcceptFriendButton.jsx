import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { URL, socket, token, userId } from '../../utilities/Config';
import { Toast } from 'toastify-react-native';
import { useAppContext } from '@/utilities/useAppContext';

const AcceptFriendButton = ({ friendId, updateFriendRequests }) => {
  const { updateFriends } = useAppContext();
  const [isRequesting, setIsRequesting] = useState(false);

  const acceptFriend = async () => {
    if (isRequesting) return; 
    setIsRequesting(true);

    const data = { requester: friendId, accepter: userId };
    
    try {
      const response = await axios.post(`${URL}friend/accept`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (socket) {
        socket.emit('acceptFriend', { friendId, userId });
      }

      Toast.success(response.data.message);
      updateFriends(response.data.data.friends);
      updateFriendRequests(response.data.data.friendRequests);
    } catch (err) {
      console.error('Error accepting friend:', err);
      Toast.error(err?.response?.data?.message || 'An error occurred');
    } finally {
      setIsRequesting(false); 
    }
  };

  return (
    <Button onPress={acceptFriend} mode="outlined" disabled={isRequesting}>
      Accept
    </Button>
  );
};

export default AcceptFriendButton;
