const mongoose=require('mongoose') ;
const dotenv=require('dotenv') ;
dotenv.config() ;
class database{
    constructor(){
        this._connect()
    }
    _connect(){
        mongoose.connect(process.env.MONGO_URI
        )
        .then(()=>{console.log("connected to database")})
        .catch((err)=>{console.log(err)}) ;
    }

}


module.exports=new database() ;
