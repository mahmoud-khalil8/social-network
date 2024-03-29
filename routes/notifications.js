const express=require('express') ;
const bodyParser=require('body-parser') ;
const User = require('../schema/userSchema');
const Chat = require('../schema/chatSchema');
const mongoose= require('mongoose');
const app = express() ;
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res, next) => {
    var payload =  {
        pageTitle: "Notifications",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    };
    res.status(200).render("notificationsPage", payload);
})

module.exports=router ;