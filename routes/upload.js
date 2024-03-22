const express=require('express') ;
const bodyParser=require('body-parser') ;
const User = require('../schema/userSchema');
const app = express() ;
const router = express.Router();
const path=require('path') ;
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/images/:path',(req,res,next)=>{
    //serving a static file
    res.sendFile(path.join(__dirname,"../uploads/images/"+req.params.path)) ;
})


module.exports=router ;