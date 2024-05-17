import { Button } from "react-native-paper";
import axios from "axios";
import { URL, token, userId } from "../../utilities/Config";
import { Toast } from "toastify-react-native";
import { useAppContext } from "../../utilities/useAppContext";

const AddFriendButton = ({ friendId, updateUserLists }) => {
  const { updateUserSentFriendRequest } = useAppContext();

  const addFriend = () => {
    const data = { requester: userId, accepter: friendId };
    axios
      .post(URL + "friend/add", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        Toast.success(data.message);
        updateUserLists(data.data.user);
        updateUserSentFriendRequest(data.data.sentFriendRequest);
      })
      .catch((err) => Toast.error(err.message));
  };

  return (
    <Button onPress={addFriend} mode="contained">
      Add Friend
    </Button>
  );
};

export default AddFriendButton;
