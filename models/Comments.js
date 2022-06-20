const mongoose = require('mongoose')
const { stringify } = require('postcss')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    body:{
        type:String
    },

    commented_post_id:{
        type:Schema.ObjectId,
    },

    comment_by_user_id:{
        type:Schema.ObjectId,
    }
})

const Comments = mongoose.model('Comments', commentSchema)

module.exports = Comments