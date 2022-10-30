const express = require('express')
const ejs = require('ejs')
// const mongoose = require("mongoose")
const cors = require("cors")
const PORT = process.env.PORT || 4000
const UserAuth = require("./controllers/user.controller")
const Post = require("./controllers/post.controller")

app.use(cors({
  origin: '*'
})); 
app.use(express.json())

app.set("view engine", "ejs")
app.get("/", (req, res) => {
  res.render("index")
})

const db = require("./config/dbConfig").MongoURL
// mongoose.Promise = global.Promise

// mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("connected to mongo database"))
//     .catch(err => console.log(err))
    app.get("/", (req, res) => {
        res.render("index")
    })
  
    app.use('/api', UserAuth)
    app.use('/api', Post)
    

app.listen(PORT)