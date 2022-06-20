const express = require('express')
const cors = require('cors')
const upload = require('express-fileupload')
const app = express()
app.use(express.static("public"))
app.use(cors())
app.use(upload())
app.use(express.json())
const Posts = require('./models/Posts')
const Users = require('./models/Users')
const connect_db = require('./connect_db')

connect_db()


const user = require('./routes/apis/user')
app.use('/apis/user', user)

const posts = require('./routes/apis/posts')
app.use('/apis/posts', posts)

const likes = require('./routes/apis/likes')
app.use('/apis/likes', likes)

const comments = require('./routes/apis/comments')
app.use('/apis/comments', comments)

//admin panel
const admin_user = require('./routes/admin_panel/user')
app.use('/admin_panel/user', admin_user)

const admin_post = require('./routes/admin_panel/posts')
app.use('/admin_panel/posts', admin_post)

// const get_posts = require('./routes/apis/get_all_posts')
// app.use('/apis/posts', get_posts)



const port = 5000
app.listen(5000, () => {
    console.log(`The server is running at ${port}`)
})