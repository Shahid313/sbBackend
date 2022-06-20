const router = require('express').Router()
const Users = require('../../models/Users')

const fs = require('fs')

router.get('/get_all_users',(req, res)=>{
    Users.find()
    .then(users=>{
        res.json({
            "users":users
        })
    })
})


router.get('/delete_user',(req, res)=>{
    const id = req.query.id
    Users.findById(id)
    .then(user=>{
        if(user.background_image != ''){
            fs.unlink('public/uploads/profile_images/'+user.background_image,function(result){
                console.log(result)
            })
        }
    })


    Users.findByIdAndDelete(id)
    .then(()=>{
        res.json({
            "msg":"Deleted Succesfully"
        })
    })
})

module.exports = router