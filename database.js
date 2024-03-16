const mongoose=require('mongoose') ;
class database{
    constructor(){
        this._connect()
    }
    _connect(){
        mongoose.connect('mongodb+srv://mahmoudkhalil8g:8uR6WBW6234cd9hX@cluster0.ehsunmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
        )
        .then(()=>{console.log("connected to database")})
        .catch((err)=>{console.log(err)}) ;
    }

}


module.exports=new database() ;
