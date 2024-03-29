const mongoose=require('mongoose');
const schema=mongoose.Schema ;
const notificationsSchema=new schema({
    userTo:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFrom:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notificationType:{type:String},
    opened:{type:Boolean,default:false},
    entityId:{type:mongoose.Schema.Types.ObjectId},
},{timestamps:true}) ;

const Notifications=mongoose.model('Notifications',notificationsSchema) ;

module.exports=Notifications;
