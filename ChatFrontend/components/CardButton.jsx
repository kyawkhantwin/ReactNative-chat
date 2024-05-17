import React from "react";
import AcceptFriendButton from "./Friend/AcceptFriendButton";
import UnfriendButton from "./Friend/UnfriendButton";
import FriendButton from "./Friend/FriendButton";
import AddFriendButton from "./Friend/AddFriendButton";
import CancelSentRequest from "./Friend/CancelSentRequest";

const CardButton = ({
  title,
  friendId,
  updateUserLists,
  updateFriendRequests,
  updateFriend,

}) => {
  return (
    <>
      {title === "Request" ? (
        <AcceptFriendButton
          friendId={friendId}
          updateFriend={updateFriend}
          updateFriendRequests={updateFriendRequests}
        />
      ) : title === "Friend" ? (
        <>
          <UnfriendButton
            friendId={friendId}
            updateUserLists={updateUserLists}
            updateFriend={updateFriend}
          />
          <FriendButton />
        </>
      ) : title === 'SentRequest' ? (
        (
        <CancelSentRequest
          friendId={friendId}
          updateUserLists={updateUserLists}
          
        />
      )
      ):(
        <AddFriendButton

          friendId={friendId}
          updateUserLists={updateUserLists}
        />
      )}
    </>
  );
};

export default CardButton;
