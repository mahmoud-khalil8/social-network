const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schema/userSchema');
const Post = require('../../schema/postSchema');
const Chat = require('../../schema/chatSchema');
const Message = require('../../schema/messageSchema');

app.use(bodyParser.urlencoded({ extended: false }));
router.post("/", async (req, res, next) => {
    if(!req.body.content || !req.body.chatId) {
        console.log("Invalid data passed to send message");
        return res.sendStatus(400);
    }
    var newMessage={
        sender:req.session.user._id,
        content:req.body.content,
        chat:req.body.chatId,
    }
    Message.create(newMessage)
    .then(async message=>{
        message=await message.populate("sender").execPopulate();
        message=await message.populate("chat").execPopulate();
        message=await User.populate(message,{path:"chat.users"});
        var chat=await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message})
        res.status(201).send(message);
    })
    .catch(error=>{
        console.log(error);
        return res.sendStatus(400);
    })
})

module.exports = router;