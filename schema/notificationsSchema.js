const mongoose=require('mongoose');
const schema=mongoose.Schema ;
const notificationsSchema=new schema({
    userTo:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFrom:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notificationType:{type:String},
    opened:{type:Boolean,default:false},
    entityId:{type:mongoose.Schema.Types.ObjectId},
},{timestamps:true}) ;
notificationsSchema.statics.insertNotification=async(userTo,userFrom,notificationType,entityId)=>{
    var data={
        userTo,
        userFrom,
        notificationType,
        entityId,
    }
    await Notifications.deleteOne(data).catch(error=>console.log(error));
    return Notifications.create(data).catch(error=>console.log(error));
}
var Notifications=mongoose.model('Notifications',notificationsSchema) ;

module.exports=Notifications;
