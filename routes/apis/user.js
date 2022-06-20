const router = require('express').Router()
const Users = require('../../models/Users')
const bcrypt = require('bcrypt'); 
const saltRounds = 10
const FollowedUsers = require('../../models/FollowedUsers')
const fs = require('fs')
const mongoose = require('mongoose')

router.post('/signup', (req, res) => {
    let hash_password;
    let name = req.body.name
    let email = req.body.email
    let user_role = req.body.user_role
    const file = req.files.image
    const filename = file.name
    file.mv('public/uploads/profile_images/'+filename, function(err){
        if(err){
            res.send(err)
        }
    })
    let password = req.body.password
    bcrypt.hash(password,saltRounds, (err, hash) => {
        hash_password = hash

        try{
            Users.findOne({email:email}).then(
                result => {
                    if(result != null){
                        res.send({
                            "msg":"User Already Exists"
                        })
                    }else{
                        const user = new Users({
                        "name":name,
                        "email":email,
                        "password":hash_password,
                        "image":filename,
                        "background_image1":"",
                        "background_image2":"",
                        "user_role":user_role
                        })
        user.save()
        return res.send({
            "msg":"User registered successfully"
        })
                    }
                }
            )
        }catch(err){
            res.status(422).send(err.message)
        }
    })

    
})


//signup_without_image
router.post('/signup_with_out_image', (req, res) => {
  let hash_password;
  let name = req.body.name
  let email = req.body.email
  let user_role = req.body.user_role
  let password = req.body.password
  bcrypt.hash(password,saltRounds, (err, hash) => {
      hash_password = hash

      try{
          Users.findOne({email:email}).then(
              result => {
                  if(result != null){
                      res.send({
                          "msg":"User Already Exists"
                      })
                  }else{
                      const user = new Users({
                      "name":name,
                      "email":email,
                      "password":hash_password,
                      "image":"null",
                      "background_image":"",
                      "user_role":user_role
                      })
      user.save()
      return res.send({
          "msg":"User registered successfully"
      })
                  }
              }
          )
      }catch(err){
          res.status(422).send(err.message)
      }
  })

  
})

 

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
     Users.findOne({email:email})
     .then(user=>{
      if(user != null){
        bcrypt.compare(password, user.password, function(error, response) {
          console.log(response)
         if(response == true){
           res.send({
             "user":user,
             "msg":"Logged in Succesfully"
           })
         }else{
           res.send({
             "msg":"Incorrect email or password"
           })
         }
      });
      }else{
       res.send({
         "msg":"Incorrect email or password"
       })
     }
  
     })
    })


    router.post('/login_with_google',(req,res)=>{
      let name = req.body.name
      let email = req.body.email
      let image = req.body.image
      let user_role = req.body.user_role
      Users.findOne({email:email})
      .then(user=>{
        if(user != null){
          return res.send({
            "user":user,
             "msg":"logged in Succesfully"
          })
        }else{
          const user = new Users({
            "name":name,
            "email":email,
            "password":"loggedin_with_google",
            "image":image,
            "background_image":"",
            "user_role":user_role
            })
            user.save().then(user => {
              return res.send({
                "user":user,
                "msg":"logged in with google successfully"
              })
            })
            
        }
      })
    })



    router.get("/follow_unfollow",(req,res)=>{
      const  my_id = req.query.my_id
      const user_id = req.query.user_id
      
    
       FollowedUsers.findOne({$and: [{followed_by: my_id}, {user_id: user_id}]})
        .then(user=>{
         
            if(user != null){
                
                
                FollowedUsers.findByIdAndDelete(user._id)
               
                .then(res=>{
                    console.log("Deleted")
                })
    
                res.json({
                    "msg":"unfollowed"
                })
            }else{
                const follow_user = new FollowedUsers({
                    "followed_by":my_id,
                    "user_id":user_id
                })
                follow_user.save()
                res.json({
                    "msg":"followed"
                })
            }
        })
       
    
    })
    
    
    router.get("/view_user",(req,res)=>{
        const  my_id = req.query.my_id
        const user_id = req.query.user_id
        
       
    
       
       Users.findById(user_id)
       .then(user=>{
       FollowedUsers.findOne({$and: [{followed_by: my_id}, {user_id: user_id}]})
       .then(is_followed=>{
    
        res.json({
            "is_followed":is_followed == null?0:1,
            "user":user,
            "msg":"Found"
        })
        })
        })
        .catch(err=>{
            res.json({
                "msg":"Not Found"
            })
        })
      
          
         
      
      })


//update image 1

router.post('/updated_background_image1',(req,res)=>{
  const user_id = req.body.user_id
  const file1 = req.files.image1
  const filename1 = file1.name
  console.log(filename1)
  Users.findById(user_id)
  .then(async (user)=>{
    fs.unlink('public/uploads/background_images1/'+user.background_image1,function(result){
     console.log(result)
    })

    file1.mv('public/uploads/background_images1/'+filename1, function(err){
        if(err){
            res.send(err)
        }
      })

      let filter = { _id: user_id };
      let updateDoc = {
          $set: {
              "background_image1":filename1,
          }

      }

      await Users.updateMany(filter,updateDoc)

    return res.json({
      "msg":"Background Image Updated Succesfully"
    })

  })
})

// update image2

router.post('/updated_background_image2',(req,res)=>{
  const user_id = req.body.user_id
  const file2 = req.files.image2
  const filename2 = file2.name
  console.log(filename2)
  Users.findById(user_id)
  .then(async (user)=>{
    fs.unlink('public/uploads/background_images2/'+user.background_image2,function(result){
     console.log(result)
    })

    file2.mv('public/uploads/background_images2/'+filename2, function(err){
        if(err){
            res.send(err)
        }
      })

      let filter = { _id: user_id };
      let updateDoc = {
          $set: {
              "background_image2":filename2
          }

      }

      await Users.updateMany(filter,updateDoc)

    return res.json({
      "msg":"Background Image Updated Succesfully"
    })

  })
})

router.get('/get_header_image_by_user_id', (req, res) => {
  const user_id = req.query.user_id
  Users.findById(user_id).then(user => {
    res.json({
      "user":user
    })
  })
})


router.get('/get_all_users', (req, res) => {
  Users.find().then(users => {
    res.json({"users":users})
  })
})


router.get('/get_user_by_user_id', (req, res) => {
  const user_id = mongoose.Types.ObjectId(req.query.user_id)
  Users.findById(user_id).then(user => {
    res.json({
      "user":user
    })
  })
})

module.exports = router