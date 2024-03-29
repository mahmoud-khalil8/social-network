const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schema/userSchema');
const Post = require('../../schema/postSchema');
const Chat = require('../../schema/chatSchema');
const Message = require('../../schema/messageSchema');
const Notifications=require('../../schema/notificationsSchema') ;

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    if(!req.body.content || !req.body.chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId
    };

    Message.create(newMessage)
    .then(async message => {
        Message.findOne({ _id: message._id })
        message = await message.populate("sender");
        message = await message.populate("chat");
        message= await User.populate(message,{path:"chat.users"})
        var chat = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
        .catch(error => console.log(error));
        insertNotifications(chat,message)
        res.status(201).send(message);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

function insertNotifications(chat ,message){
    chat.users.forEach((userId)=>{
        if(userId==message.sender._id.toString()) return ;
        Notifications.insertNotification(userId,message.sender._id,"newMessage",message.chat._id) ;
    })
}
module.exports = router;