const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: { type: String, required: true ,trim:true},
    lastName: { type: String, required: true,trim:true },
    username: { type: String, required: true ,trim:true},
    email: { type: String, required: true },
    password: { type: String, required: true } ,
    profilePic: { type: String, default: "/images/profilePic.jpg" },
    likes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]

}, { timestamps: true}); 
const User = mongoose.model('User', userSchema);
module.exports = User;
