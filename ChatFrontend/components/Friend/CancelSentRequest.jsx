import React from "react";
import { URL, token, userId } from "../../utilities/Config";
import axios from "axios";
import { Toast } from "toastify-react-native";
import { Button } from "react-native-paper";
import { useAppContext } from "../../utilities/useAppContext";

const CancelSentRequest = ({friendId,updateUserLists,}) => {
  const {updateUserSentFriendRequest} = useAppContext()
  const cancelRequest = () => {
    const data = { userId, friendId };
    axios
      .post(URL + "friend/user-request-cancel", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        Toast.success(data.message);
        updateUserLists(data.data.friend);
        updateUserSentFriendRequest(data.data.sentFriendRequest);
      })
      .catch((err) => {
        console.log(err.message);
        console.log(err.response.data.message);
        Toast.error(err.response.data.message);
      });
  };

  return (
    <Button onPress={cancelRequest} mode="outlined">
      Cancel
    </Button>
  );
};

export default CancelSentRequest;
