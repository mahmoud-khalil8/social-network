const express=require('express') ;
const app = express() ;
const middleware=require('./middleware') ;
const path=require("path");
const bodyParser=require('body-parser') ;
const session=require('express-session') ;
const db=require('./database') ;


const server=app.listen(3000,()=>{console.log("app listening on port 3000")}) ;
const io=require('socket.io')(server,{pingTimeout:60000}) ;


const loginRoute=require('./routes/loginRoute') ;
const registerRoute=require('./routes/registerRoute') ;
const logoutRoute=require('./routes/logout') ;
const postRoute=require('./routes/post') ;
const uploadRoute=require('./routes/upload') ;
const profileRoute=require('./routes/profile') ;
const searchRoute=require('./routes/search') ;
const messagesRoute=require('./routes/messages') ;
const notificationsRoute=require('./routes/notifications') ;

const postsApi=require('./routes/api/posts') ;
const usersApi=require('./routes/api/users') ;
const chatsApi=require('./routes/api/chats') ;
const messagesApi=require('./routes/api/messages') ;
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
app.use('/uploads',uploadRoute) ;

app.use('/search',middleware.loginMiddleware,searchRoute) ;
app.use('/post',middleware.loginMiddleware,postRoute) ;
app.use('/profile',middleware.loginMiddleware,profileRoute) ;
app.use('/messages',middleware.loginMiddleware,messagesRoute) ;
app.use('/notifications',middleware.loginMiddleware,notificationsRoute) ;

app.use('/api/posts',postsApi) ;
app.use('/api/users',usersApi) ;
app.use('/api/chats',chatsApi) ;
app.use('/api/messages',messagesApi) ;

app.use(express.static(path.join(__dirname,"public"))) ;

app.get('/',middleware.loginMiddleware,(req,res,next)=>{
    var payLoad={
        pageTitle:"home page",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user),
    }
    res.status(200).render("home",payLoad) ;
})

io.on('connection',(socket)=>{
    socket.on('setup',userData=>{
        socket.join(userData._id) ;
        socket.emit('connected') ;
    })
    socket.on('join room',room=>{
        socket.join(room) ;
    })
    socket.on('typing',room=>{
        //emitting only to the room
        socket.in(room).emit('typing') ;
    })
    socket.on('stop typing',room=>{
        socket.in(room).emit('stop typing') ;
    })
    socket.on('new message',newMessage=>{
        var chat =newMessage.chat ;
        //emitting to all users in the chat to their own rooms except the sender
        
        if(!chat.users) return console.log("chat.users not defined") ;

        chat.users.forEach(user=>{
            if(user._id==newMessage.sender._id) return ;
            socket.in(user._id).emit('message received',newMessage) ;
        })
    })

})