const express=require('express') ;
const bodyParser=require('body-parser') ;
const User = require('../schema/userSchema');
const app = express() ;
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',(req,res,next)=>{
    var payload={
        title:req.session.user.username,
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user),
        profileUser:req.session.user,
        
    }
    res.status(200).render('profilePage',payload) ;
})
router.get("/:username", async (req, res, next) => {

    var payload = await getPayload(req.params.username, req.session.user);
    
    res.status(200).render("profilePage", payload);
})

router.get("/:username/replies", async (req, res, next) => {

    var payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "replies";
    
    res.status(200).render("profilePage", payload);
})
async function getPayload(username,userLoggedIn){
    var user=await User.findOne({username:username}) ;
    if(user==null){
        user =await User.findById(username) ;
        if(user==null){

            return{
                title:"User not found",
                userLoggedIn:userLoggedIn,
                userLoggedInJs:JSON.stringify(userLoggedIn),
            }
        }
    }
    return {
        title:user.username,
        userLoggedIn:userLoggedIn,
        userLoggedInJs:JSON.stringify(userLoggedIn),
        profileUser:user,
    }
    
}

module.exports=router ;