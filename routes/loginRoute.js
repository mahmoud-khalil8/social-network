const express=require('express') ;
const bodyParser=require('body-parser') ;
const user=require('../schema/userSchema') ;
const User = require('../schema/userSchema');
const app = express() ;
const router = express.Router();
const bcrypt = require('bcrypt');
router.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine" ,"pug") ;
app.set("views","views") ;


router.get('/',(req,res,next)=>{
    res.status(200).render('login') ;
})
router.post ('/',async (req,res,next)=>{
    const payload=req.body ;
    if(req.body.loginEmail && req.body.loginPassword){
            const user=await User.findOne({email : req.body.loginEmail}) ;
        
        if(user){
            const passwordCorrect=await bcrypt.compare(req.body.loginPassword,user.password) ;
            if(passwordCorrect){
                req.session.user=user ;
                return res.redirect('/') ;
            }
        }else{
            payload.errorMessage="login credentials incorrect" ;
            return res.status(200).render('login',payload) ;
        }
    } 
    payload.errorMessage="something went wrong" ;
    res.status(200).render('login',payload) ;  
})
module.exports=router ;