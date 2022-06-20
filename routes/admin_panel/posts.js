const router = require('express').Router()
const Posts = require('../../models/Posts')
const Comments = require('../../models/Comments')
const fs = require('fs')

router.get('/get_all_posts',(req, res) =>{
  
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
       
        res.json({
            "all_posts":posts,
           
        })

})
})


router.get('/delete_post',(req, res) =>{
    const post_id = req.query.post_id
    Posts.findById(post_id).then(post=>{
        Comments.find({commented_post_id:post._id})
        .then(comments=>{
            comments.forEach(comment=>{
                Comments.findByIdAndDelete(comment._id);
            })
        })
        if(post.post_image != null){
            fs.unlink('public/uploads/post_images/'+post.post_image,function(result){
                console.log(result)
               })
        }
    })


    Posts.findByIdAndDelete(post_id).then(()=>{
        return res.json({
            "msg":"Post Deleted Succesfully"
        })
    })
})



router.get('/delete_comment', (req, res) => {
    const comment_id = req.query.comment_id
    Comments.findByIdAndDelete(comment_id).then(()=>{
        return res.json({
            "msg":"Comment Deleted Succesfully"
        })
    })
    .catch(err=>{
        return res.json({
            "msg":err
        })
    })
})

module.exports = router