const express = require("express")
const app = express()
const ejs = require("ejs")
const cors = require("cors")
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: '*'
})); 
app.use(express.json())

app.set("view engine", "ejs")
app.get("/", (req, res) => {
  res.render("index")
})

app.get("/hng-task1", (req, res) => {
   return res.json({ 
     slackUsername : "samson onifade",
     age: 21,
     backend: true,
     bio: "My name is samson onifade, a backend developer"
   })
})

app.listen(PORT)