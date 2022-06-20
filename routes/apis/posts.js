const router = require('express').Router();
const Posts = require('../../models/Posts')

const Users = require('../../models/Users')
const Comments = require('../../models/Comments')
const Likes = require('../../models/Likes')
const joinQuery = require("mongo-join-query");
const mongoose = require('mongoose');
const FollowedUsers = require('../../models/FollowedUsers');

router.post('/add_new_post_without_image', (req, res) => {
    let content = req.body.content
    let user_id = req.body.user_id
        try{
            const new_post = new Posts({
                "person_name_whose_is_shared":"null",
                "person_image_whose_post_is_shared":"null",
                "content":content,
                "post_image":"null",
                "user_id":user_id,
                "is_shared":0
            })

            new_post.save()
            return res.send({
                "msg":"Post added successfully"
            })
        }catch(err){
            res.status(422).send(err.message)
        }
    })


        router.post('/add_new_post_without_content', (req, res) => {
            let user_id = req.body.user_id
            const file = req.files.post_image
            const filename = file.name

                file.mv('public/uploads/post_images/'+filename, function(err){
                    if(err){
                        res.send(err)
                    }
                })
        
                try{
                    const new_post = new Posts({
                        "person_name_whose_is_shared":"null",
                        "person_image_whose_post_is_shared":"null",
                        "content":"null",
                        "post_image":filename,
                        "user_id":user_id,
                        "is_shared":0
                    })
        
                    new_post.save()
                    return res.send({
                        "msg":"Post added successfully"
                    })
                }catch(err){
                    res.status(422).send(err.message)
                }
            })


            router.post('/add_new_post_with_content_and_image', (req, res) => {
                let content = req.body.content
                let user_id = req.body.user_id
                const file = req.files.post_image
                const filename = file.name
                    file.mv('public/uploads/post_images/'+filename, function(err){
                        if(err){
                            res.send(err)
                        }
                    })
            
                    try{
                        const new_post = new Posts({
                            "person_name_whose_is_shared":"null",
                            "person_image_whose_post_is_shared":"null",
                            "content":content,
                            "post_image":filename,
                            "user_id":user_id,
                            "is_shared":0
                        })
            
                        new_post.save()
                        return res.send({
                            "msg":"Post added successfully"
                        })
                    }catch(err){
                        res.status(422).send(err.message)
                    }
                })

             
                
   
    router.get('/get_all_posts', (req, res) => {
    const my_id = req.query.my_id
    var all_posts = []
    
    //Getting My Posts Starts
    Posts.aggregate([
        {
            $lookup:{
                from:'users',
                localField:"user_id",
                foreignField:'_id',
                as:'post_user'
            }
            
        },

        {
            $lookup:{
                from:'followedusers',
                localField:"user_id",
                foreignField:'user_id',
                as:'followed_users'
            }
            
            
        },
        
        {
            $lookup:{
                from:'likes',
                localField:"_id",
                foreignField:'liked_post_id',
                as:'post_likes'
            }
            
            
        },

        {
            $lookup:{
                from:'comments',
                localField:"_id",
                foreignField:'commented_post_id',
                as:'comments'
            }
            
            
        },
        
    ]).then(posts => {
            posts.forEach(data=>{
                data.followed_users.forEach(user => {
                    if(user.followed_by == my_id){
                        all_posts.push(data)
                    } 
                })
                if(data.user_id == my_id){
                    all_posts.push(data)
                }
                
            
            })
            res.json({
                "all_posts":all_posts,
                "msg":"working"
                
               
            })
    })
   
})



router.post('/share_post', (req, res) => {
const post_id = req.body.post_id
const my_id = req.body.my_id
Posts.findById(post_id)
.then(post=>{
        Users.findById(post.user_id).then(user => {
            const new_post = new Posts({
                "person_name_whose_is_shared":user.name,
                "person_image_whose_post_is_shared":user.image,
                "content":post.content,
                "post_image":post.post_image,
                "user_id":my_id,
                "is_shared":1
                })
                new_post.save()
        })
        


            
        })
        res.json({
            "msg":"Shared"
        })
    })
   
    



module.exports = router