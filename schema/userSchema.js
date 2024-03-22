const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: { type: String, required: true ,trim:true},
    lastName: { type: String, required: true,trim:true },
    username: { type: String, required: true ,trim:true},
    email: { type: String, required: true },
    password: { type: String, required: true } ,
    profilePic: { type: String, default: "/images/profilePic.jpg" },
    coverPhoto: { type: String },
    likes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    retweets:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true}); 
const User = mongoose.model('User', userSchema);
module.exports = User;
