const express = require("express")
const { sendMessage, getMessage } = require("../Controller/ChatController")
const  Middleware  = require("../Middleware/Middleware")
const Router = express.Router()
Router.use(Middleware)

Router.post('/send',sendMessage)
Router.get('/send',getMessage)

module.exports = Router