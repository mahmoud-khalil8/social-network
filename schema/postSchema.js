const mongoose=require('mongoose');
const schema=mongoose.Schema ;
const postSchema=new schema({
    content:{type:String,trim:true},
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pinned:{type:Boolean},
    likes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetData:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]

},{timestamps:true}) ;
const Post=mongoose.model('Post',postSchema) ;

module.exports=Post ;
