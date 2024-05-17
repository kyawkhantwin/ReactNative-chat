const express = require("express")
const { AddFriend, AcceptFriend, RemoveFriend, showFriends, showFriendRequests, showUserSentRequest, cancelUserSentRequest } = require("../Controller/FriendController")
const Middleware = require("../Middleware/middleware")
const Router = express.Router()
Router.use(Middleware)

Router.get('/',showFriends)
Router.get('/request',showFriendRequests)
Router.get('/user-request',showUserSentRequest)
Router.post('/user-request-cancel',cancelUserSentRequest)

// friend adding 
Router.post('/add',AddFriend)
Router.post('/accept',AcceptFriend)
Router.post('/unfriend',RemoveFriend)

module.exports = Router