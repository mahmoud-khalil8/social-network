const express=require('express') ;
const app = express() ;
const middleware=require('./middleware') ;
const path=require("path");
const bodyParser=require('body-parser') ;
const session=require('express-session') ;
const db=require('./database') ;

const loginRoute=require('./routes/loginRoute') ;
const registerRoute=require('./routes/registerRoute') ;
const logoutRoute=require('./routes/logout') ;
const postRoute=require('./routes/post') ;

const postsApi=require('./routes/api/posts') ;
const Post = require('./schema/postSchema');
app.set("view engine" ,"pug") ;
app.set("views","views") ;
app.use(bodyParser.urlencoded ({extended:true}))

app.use(session({
    secret:"macarona-bashamel",
    resave:true,
    saveUninitialized:false
}))
app.use('/login',loginRoute) ;
app.use('/register',registerRoute) ;
app.use('/logout',logoutRoute) ;
app.use('/post',postRoute) ;

app.use('/api/posts',postsApi) ;

app.use(express.static(path.join(__dirname,"public"))) ;

app.get('/',middleware.loginMiddleware,(req,res,next)=>{
    var payLoad={
        title:"home page",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user),
    }
    res.status(200).render("home",payLoad) ;
})
app.listen(3000,()=>{console.log("app listening on port 3000")}) ;