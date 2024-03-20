const express=require('express') ;
const bodyParser=require('body-parser') ;
const User = require('../schema/userSchema');
const app = express() ;
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:id',(req,res,next)=>{
    var payload={
        title:"Post",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user),
        postId:req.params.id,

    }
    res.status(200).render('postPage',payload) ;
})

module.exports=router ;