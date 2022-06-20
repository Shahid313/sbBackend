const router = require('express').Router();
const Posts = require('../../models/Posts')
const Users = require('../../models/Users')
const Comments = require('../../models/Comments');
const { route } = require('./likes');
const mongoose = require('mongoose')

router.post('/comment', (req, res) => {
    let body = req.body.body
    let comment_by_user_id = mongoose.Types.ObjectId(req.body.comment_by_user_id)
    let commented_post_id = mongoose.Types.ObjectId(req.body.commented_post_id)
        try{
            const new_comment = new Comments({
                "body":body,
                "commented_post_id":commented_post_id,
                "comment_by_user_id":comment_by_user_id
            })

            new_comment.save()
            return res.send({
                "msg":"Comment added successfully"
            })
        }catch(err){
            res.status(422).send(err.message)
        }
    })

    module.exports = router