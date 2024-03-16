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
    if(req.session){
        req.session.destroy(()=>{
            res.redirect('/login') ;
        })
    }
})

module.exports=router ;