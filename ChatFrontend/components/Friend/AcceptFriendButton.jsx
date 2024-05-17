import { Button } from "react-native-paper";
import axios from "axios";
import { URL, token, userId } from "../../utilities/Config";
import { Toast } from 'toastify-react-native'


const AcceptFriendButton = ({
  friendId,
  updateFriend,
  updateFriendRequests,
}) => {
  const acceptFriend = () => {
    const data = { requester: friendId, accepter: userId };
    axios
      .post(URL + "friend/accept", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        Toast.success(data.message);
        updateFriend(data.data.friends);
        updateFriendRequests(data.data.friendRequests);
      })
      .catch((err) => Toast.error(err.response.data.message));
  };

  return (
    <Button onPress={acceptFriend} mode="outlined">
      Accept
    </Button>
  );
};

export default AcceptFriendButton;
