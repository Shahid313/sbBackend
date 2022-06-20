const router = require('express').Router();
const Posts = require('../../models/Posts')
const Users = require('../../models/Users')
const Likes = require('../../models/Likes')
const mongoose = require('mongoose')

router.post('/like_dislike_post', (req, res) => {
    let liked_post_id = mongoose.Types.ObjectId(req.body.liked_post_id)
    let liked_by_user_id = mongoose.Types.ObjectId(req.body.liked_by_user_id)
    Likes.find({$and: [{liked_post_id: liked_post_id}, {liked_by_user_id: liked_by_user_id}]}).then(
        like => {
            if(like == ''){
                try{
                    const new_like = new Likes({
                        "isLiked":1,
                        "liked_post_id":liked_post_id,
                        "liked_by_user_id":liked_by_user_id
                    })
        
                    new_like.save()
                    return res.send({
                        "msg":"Liked",
                    })
                }catch(err){
                    res.status(422).send(err.message)
                }
            }else{
                Likes.findOneAndDelete({$and: [{liked_post_id: liked_post_id}, {liked_by_user_id: liked_by_user_id}]}).then(
                    res.send({
                        "msg":"disLiked"
                    })
                )
            }
        }
    )
        
    })


    router.get('/get_likes', (req, res) => {
        let liked_by_user_id = mongoose.Types.ObjectId(req.body.liked_by_user_id)
        Likes.find({liked_by_user_id: liked_by_user_id}).then(
            like => {
                if(like){
                    res.send({
                        "msg":"Found Liked"
                    })
                }else{
                    res.send({
                        "msg":"Not Found Liked"
                    })
            }

            
    })

})

    module.exports = router