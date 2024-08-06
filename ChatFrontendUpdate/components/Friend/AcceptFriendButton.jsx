import { Button } from "react-native-paper";
import axios from "axios";
import { URL, token, userId } from "../../utilities/Config";
import { Toast } from "toastify-react-native";
import { useAppContext } from "@/utilities/useAppContext";

const AcceptFriendButton = ({ friendId, updateFriendRequests }) => {
  const { updateFriends } = useAppContext();

  const acceptFriend = () => {
    const data = { requester: friendId, accepter: userId };
    axios
      .post(URL + "friend/accept", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
        Toast.success(data.message);
        updateFriends(data.data.friends);
        updateFriendRequests(data.data.friendRequests);
      })
      .catch((err) => {
        console.log(err);
        Toast.error(err?.response?.data?.message);
      });
  };

  return (
    <Button onPress={acceptFriend} mode="outlined">
      Accept
    </Button>
  );
};

export default AcceptFriendButton;
