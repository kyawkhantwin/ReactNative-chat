const { User } = require("../Model/Model");
const mongoose = require("mongoose");

function toObjectId(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return null;
}

const getFriend = async (req, res) => {
  const { friendId } = req.params;

  const friendObjectId = toObjectId(friendId);
  try {
    if (!friendObjectId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const friend = await User.findById(friendObjectId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    return res.status(200).json({ message: "One Friend", data: friend });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Show People
const showPeople = async (req, res) => {
  const { userId } = req.query;
  const userObjectId = toObjectId(userId);

  try {
    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userObjectId);

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

// Add Friend
const AddFriend = async (req, res) => {
  const { requester, accepter } = req.body;
  const requesterObjectId = toObjectId(requester);
  const accepterObjectId = toObjectId(accepter);

  try {
    if (!requesterObjectId || !accepterObjectId) {
      return res
        .status(400)
        .json({ message: "Invalid requester or accepter ID" });
    }

    const requestUser = await User.findById(requesterObjectId);
    const acceptUser = await User.findById(accepterObjectId);

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

    requestUser.sentFriendRequests.push(acceptUser._id);
    acceptUser.friendRequests.push(requestUser._id);

    await acceptUser.save();
    const user = await requestUser.save();

    const updateUser = await excludeUserFriendsAndFriendRequest(requestUser);
    const sentRequestIds = user.sentFriendRequests;
    const sentFriendRequest = await User.find({ _id: { $in: sentRequestIds } });

    return res.status(200).json({
      message: "Friend request sent successfully",
      data: { user: updateUser, sentFriendRequest },
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Accept Friend
const AcceptFriend = async (req, res) => {
  const { requester, accepter } = req.body;
  const requesterObjectId = toObjectId(requester);
  const accepterObjectId = toObjectId(accepter);

  try {
    if (!requesterObjectId || !accepterObjectId) {
      return res
        .status(400)
        .json({ message: "Invalid requester or accepter ID" });
    }

    const requestedUser = await User.findById(requesterObjectId);
    const acceptedUser = await User.findById(accepterObjectId);

    if (!requestedUser) {
      return res.status(404).json({ message: "Requested User Not Found" });
    }

    if (requestedUser._id.toString() === acceptedUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot accept yourself as a friend" });
    }

    if (!acceptedUser.friendRequests.includes(requesterObjectId)) {
      return res
        .status(400)
        .json({ message: "Friend request not found for accepted user" });
    }

    if (acceptedUser.friends.includes(requestedUser._id)) {
      return res.status(400).json({ message: "Already Friends" });
    }

    acceptedUser.friendRequests = acceptedUser.friendRequests.filter(
      (request) => request.toString() !== requester
    );
    requestedUser.sentFriendRequests = requestedUser.sentFriendRequests.filter(
      (accept) => accept.toString() !== accepter
    );

    acceptedUser.friends.push(requestedUser._id);
    requestedUser.friends.push(acceptedUser._id);

    await acceptedUser.save();
    await requestedUser.save();

    const populatedAcceptUser = await User.findById(accepterObjectId._id)
      .populate("friends")
      .populate("friendRequests");

    const updateFriends = populatedAcceptUser.friends;
    const updateFriendRequest = populatedAcceptUser.friendRequests;

    return res.status(200).json({
      message: "Friend request accepted successfully",
      data: { friends: updateFriends, friendRequests: updateFriendRequest },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove Friend
const RemoveFriend = async (req, res) => {
  const { removeUser, user } = req.body;
  const removeUserObjectId = toObjectId(removeUser);
  const userObjectId = toObjectId(user);

  try {
    if (!removeUserObjectId || !userObjectId) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const userToRemove = await User.findById(removeUserObjectId);
    const mainUser = await User.findById(userObjectId);

    if (!userToRemove || !mainUser) {
      return res.status(404).json({ message: "Users not found" });
    }

    if (!mainUser.friends.includes(userToRemove._id)) {
      return res.status(400).json({ message: "Users are not friends" });
    }

    mainUser.friends = mainUser.friends.filter(
      (friend) => !friend.equals(userToRemove._id)
    );

    userToRemove.friends = userToRemove.friends.filter(
      (friend) => !friend.equals(mainUser._id)
    );

    await userToRemove.save();
    const updatedUser = await mainUser.save();
    const updatedFriend = (await updatedUser.populate("friends")).friends;

    const people = await excludeUserFriendsAndFriendRequest(updatedUser);

    return res.status(200).json({
      message: "Friendship removed successfully",
      data: { friends: updatedFriend, users: people },
    });
  } catch (error) {
    console.error("Error removing friendship:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Show Friends
const showFriends = async (req, res) => {
  const { userId } = req.query;
  const userObjectId = toObjectId(userId);

  try {
    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userObjectId);

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

// Show Friend Requests
const showFriendRequests = async (req, res) => {
  const { userId } = req.query;

  try {
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

// Show User Sent Requests
const showUserSentRequest = async (req, res) => {
  const { userId } = req.query;

  try {
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

// Cancel User Sent Request
const cancelUserSentRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  const userObjectId = toObjectId(userId);
  const friendObjectId = toObjectId(friendId);

  try {
    let user = await User.findById(userObjectId);
    const friendToCancel = await User.findById(friendObjectId);

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

    const sentRequestIds = updateUser.sentFriendRequests;
    const updateSentFriendRequest = await User.find({
      _id: { $in: sentRequestIds },
    });

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

// Exclude User Friends and Friend Request
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

module.exports = {
  AddFriend,
  AcceptFriend,
  RemoveFriend,
  showFriends,
  showFriendRequests,
  showPeople,
  showUserSentRequest,
  cancelUserSentRequest,
  getFriend,
};
