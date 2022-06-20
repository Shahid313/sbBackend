const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const FollowedUsersSchema = new Schema({
   followed_by:{
       type:Schema.ObjectId
   },
   user_id:{
        type:Schema.ObjectId
   }
    
})

const FollowedUsers = mongoose.model('FollowedUsers', FollowedUsersSchema)

module.exports = FollowedUsers