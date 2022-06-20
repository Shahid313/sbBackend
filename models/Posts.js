const mongoose = require('mongoose')
const { stringify } = require('postcss')

const Schema = mongoose.Schema

const userSchema = new Schema({
    person_name_whose_is_shared:{
        type:String
    },
    person_image_whose_post_is_shared:{
        type:String
    },
    content:{
        type:String
    },

    post_image:{
        type:String
    },

    date:{
        type:Date
    },

    time:{
        type:String,
    },

    user_id:{
        type:Schema.ObjectId,
    },
    is_shared:{
        type:Number,
        required:false
    },
    shared_by:{
        type:Schema.ObjectId,
        required:false
    }
})

const Posts = mongoose.model('Posts', userSchema)
Posts.createdAt

module.exports = Posts