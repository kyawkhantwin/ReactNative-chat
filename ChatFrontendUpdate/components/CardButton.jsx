import React from "react";
import AcceptFriendButton from "./Friend/AcceptFriendButton";
import UnfriendButton from "./Friend/UnfriendButton";
import FriendButton from "./Friend/FriendButton";
import AddFriendButton from "./Friend/AddFriendButton";
import CancelSentRequest from "./Friend/CancelSentRequest";
import { useAppContext } from "@/utilities/useAppContext";

const CardButton = ({ title, friendId, updateFriendRequests }) => {
  return (
    <>
      {title === "Request" ? (
        <AcceptFriendButton
          friendId={friendId}
          updateFriendRequests={updateFriendRequests}
        />
      ) : title === "Friend" ? (
        <>
          <UnfriendButton friendId={friendId}  />
          <FriendButton />
        </>
      ) : title === "SentRequest" ? (
        <CancelSentRequest friendId={friendId} />
      ) : (
        <AddFriendButton friendId={friendId} />
      )}
    </>
  );
};

export default CardButton;
