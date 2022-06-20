const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String
    },

    email:{
        type:String,
        unique: true,
    },

    password:{
        type:String
    },

    image:{
        type:String
    },
    background_image1:{
        type:String,
        required:false
    },
    background_image2:{
        type:String,
        required:false
    },
    user_role:{
        type:String
    }
    
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users