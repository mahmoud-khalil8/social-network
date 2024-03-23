const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schema/userSchema');
const Post = require('../../schema/postSchema');
const Chat = require('../../schema/chatSchema');

app.use(bodyParser.urlencoded({ extended: false }));
router.post("/", async (req, res, next) => {
    if(!req.body.users){
        console.log("users param not sent with request")
        return res.sendStatus(400)
    }
    var users = JSON.parse(req.body.users);
    if(users.length == 0){
        console.log("users array is empty")
        return res.sendStatus(400)
    }
    users.push(req.session.user);
    var chatData = {
        users: users,
        isGroupChat: true
    }
    Chat.create(chatData)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(400)
    })

})

module.exports = router;