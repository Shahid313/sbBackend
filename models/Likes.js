const mongoose = require('mongoose')
const { stringify } = require('postcss')

const Schema = mongoose.Schema

const likeSchema = new Schema({
    isLiked:{
        type:Number
    },

    liked_post_id:{
        type:Schema.ObjectId,
    },

    liked_by_user_id:{
        type:Schema.ObjectId,
    }
})

const Likes = mongoose.model('Likes', likeSchema)

module.exports = Likes