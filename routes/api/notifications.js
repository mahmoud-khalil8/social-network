const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schema/userSchema');
const Post = require('../../schema/postSchema');
const Chat = require('../../schema/chatSchema');
const Message = require('../../schema/messageSchema');
const Notifications = require('../../schema/notificationsSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    var searchObj = { userTo: req.session.user._id, notificationType: { $ne: "newMessage" } }
    if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
        searchObj.opened = false;
    }
    Notifications.find(searchObj) 
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    
})
router.get("/latest", async (req, res, next) => {

    Notifications.findOne({ userTo: req.session.user._id}) 
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    
})
router.put("/:id/markAsOpened", async (req, res, next) => {
    Notifications.findByIdAndUpdate(req.params.id, { opened: true })
    .then(() => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})
router.put("/markAsOpened", async (req, res, next) => {
    Notifications.updateMany({ userTo: req.session.user._id }, { opened: true })
    .then(() => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})


module.exports = router;