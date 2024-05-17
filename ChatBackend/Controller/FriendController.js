const { User } = require("../Model/Model");
const mongoose = require("mongoose");

const showPeople = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const people = await excludeUserFriendsAndFriendRequest(user);

    return res
      .status(200)
      .json({ message: "Showing people", data: { user: people } });
  } catch (error) {
    console.error("Error fetching people:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const AddFriend = async (req, res) => {
  const { requester, accepter } = req.body;
  //requester main user
  //accepter from home

  try {
    if (!isValidObjectId(requester) || !isValidObjectId(accepter)) {
      return res
        .status(400)
        .json({ message: "Invalid requester or accepter ID" });
    }

    const requestUser = await User.findById(requester); // main user
    const acceptUser = await User.findById(accepter);

    if (!acceptUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (requestUser._id.toString() === acceptUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot add yourself as a friend" });
    }

    if (acceptUser.friendRequests.includes(requestUser._id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    requestUser.sentFriendRequests.push(acceptUser._id); //adding to main user sentFriendRequests
    acceptUser.friendRequests.push(requestUser._id); //adding to other user friendRequests\

    //saving both user
    await acceptUser.save();
    const user = await requestUser.save();

    const updateUser = await excludeUserFriendsAndFriendRequest(requestUser);
    const sentRequestIds = user.sentFriendRequests
    const sentFriendRequest = await User.find({ _id: { $in: sentRequestIds } });
 

    return res.status(200).json({
      message: "Friend request sent successfully",
      data: { user: updateUser,sentFriendRequest:sentFriendRequest },
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const AcceptFriend = async (req, res) => {
  const { requester, accepter } = req.body;
  //accepter main user
  //requester from friend request

  try {
    if (!isValidObjectId(requester) || !isValidObjectId(accepter)) {
      return res
        .status(400)
        .json({ message: "Invalid requester or accepter ID" });
    }

    const requestedUser = await User.findById(requester);
    const acceptedUser = await User.findById(accepter);

    if (!requestedUser) {
      return res.status(404).json({ message: "Requested User Not Found" });
    }

    if (requestedUser._id.toString() === acceptedUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot accept yourself as a friend" });
    }
    if (!acceptedUser.friendRequests.includes(requester)) {
      return res
        .status(400)
        .json({ message: "Friend request not found for accepted user" });
    }

    if (acceptedUser.friends.includes(requestedUser._id)) {
      return res.status(400).json({ message: "Already Friends" });
    }

    // Remove requestedUser from friendRequests array
    acceptedUser.friendRequests = acceptedUser.friendRequests.filter(
      (request) => request.toString() !== requester
    );
    // Remove acceptedUser from sentFriendRequests array
    requestedUser.friendRequests = requestedUser.sentFriendRequests.filter(
      (accept) => accept.toString() !== accepter
    );

    // Add each other to friends list
    acceptedUser.friends.push(requestedUser._id);
    requestedUser.friends.push(acceptedUser._id);

    await acceptedUser.save();
    await requestedUser.save();

    const updateFriends = acceptedUser.friends;
    const updateFriendRequest = acceptedUser.friendRequests;

    return res.status(200).json({
      message: "Friend request accepted successfully",
      data: { friends: updateFriends, friendRequests: updateFriendRequest },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const RemoveFriend = async (req, res) => {
  const { removeUser, user } = req.body;

  try {
    if (!isValidObjectId(removeUser) || !isValidObjectId(user)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const userToRemove = await User.findById(removeUser);
    const mainUser = await User.findById(user);

    if (!userToRemove || !mainUser) {
      return res.status(404).json({ message: " users not found" });
    }

    if (!mainUser.friends.includes(userToRemove._id)) {
      return res.status(400).json({ message: "Users are not friends" });
    }

    // Remove userToRemove from mainUser's friends list
    mainUser.friends = mainUser.friends.filter(
      (friend) => !friend.equals(userToRemove._id)
    );

    // Remove mainUser from userToRemove's friends list
    userToRemove.friends = userToRemove.friends.filter(
      (friend) => !friend.equals(mainUser._id)
    );

    await userToRemove.save();
    const updateMainUser = await mainUser.save();
    const updateFriend = await User.find({
      _id: { $in: updateMainUser.friends },
    });

    const people = await excludeUserFriendsAndFriendRequest(updateMainUser);

    return res.status(200).json({
      message: "Friendship removed successfully",
      data: { friends: updateFriend, users: people },
    });
  } catch (error) {
    console.error("Error removing friendship:", error);
    return res.status(500).json({ message: error.message });
  }
};

const showFriends = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.friends;
    const friends = await User.find({ _id: { $in: friendIds } });

    return res
      .status(200)
      .json({ message: "All your friends", data: { friends } });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const showFriendRequests = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const requestIds = user.friendRequests;
    const friendRequests = await User.find({ _id: { $in: requestIds } });

    return res
      .status(200)
      .json({ message: "This is friend request", data: { friendRequests } });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const showUserSentRequest = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sentRequestIds = user.sentFriendRequests;
    const userFriendRequest = await User.find({ _id: { $in: sentRequestIds } });

    return res.status(200).json({
      message: "This is friend request",
      data: { userRequest: userFriendRequest },
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const cancelUserSentRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    let user = await User.findById(userId);
    const friendToCancel = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!friendToCancel) {
      return res.status(404).json({ message: "Friend not found" });
    }

    user.sentFriendRequests = user.sentFriendRequests.filter(
      (sentRequest) => sentRequest.toString() !== friendId
    );

    friendToCancel.friendRequests = friendToCancel.friendRequests.filter(
      (request) => request.toString() !== userId
    );

    const updateUser = await user.save();
    await friendToCancel.save();

    
    const sentRequestIds = updateUser.sentFriendRequests
    const updateSentFriendRequest = await User.find({ _id: { $in: sentRequestIds } });

    const updateFriend = await excludeUserFriendsAndFriendRequest(updateUser);

    return res.status(200).json({
      message: "Request Cancel Successful",
      data: {
        friend: updateFriend,
        sentFriendRequest: updateSentFriendRequest,
      },
    });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    return res.status(500).json({ message: error.message });
  }
};

const excludeUserFriendsAndFriendRequest = (user) => {
  try {
    const userFriendIds =
      user.friends?.map((friend) => friend.toString()) || [];
    const userFriendRequestIds =
      user.friendRequests?.map((request) => request.toString()) || [];
    const userSentFriendRequestIds =
      user.sentFriendRequests?.map((request) => request.toString()) || [];

    const excludeIds = [
      ...userFriendIds,
      ...userFriendRequestIds,
      ...userSentFriendRequestIds,
    ];

    return User.find({
      _id: { $ne: user._id, $nin: excludeIds },
    });
  } catch (err) {
    console.log(err.message);
  }
};

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  AddFriend,
  AcceptFriend,
  RemoveFriend,
  showFriends,
  showFriendRequests,
  showPeople,
  showUserSentRequest,
  cancelUserSentRequest,
};
