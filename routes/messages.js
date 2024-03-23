const express=require('express') ;
const bodyParser=require('body-parser') ;
const User = require('../schema/userSchema');
const app = express() ;
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res, next) => {
    var payload =  {
        pageTitle: "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    };
    res.status(200).render("inboxPage", payload);
})
router.get("/new", (req, res, next) => {
    var payload =  {
        pageTitle: "new message",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    };
    res.status(200).render("newMessage", payload);
})

module.exports=router ;