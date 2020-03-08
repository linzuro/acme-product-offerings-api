const express = require('express')
const path = require('path')
const db = require('./db')

const app = express()

app.use(express.json())

app.get("/",(req,res,next)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.get("/api/products", (req,res,next)=>{
    db.readFile("products")
        .then(products=>res.send(products))
        .catch(next)
})
app.get("/api/companies", (req,res,next)=>{
    db.readFile("companies")
        .then(companies=>res.send(companies))
        .catch(next)
})
app.get("/api/offerings", (req,res,next)=>{
    db.readFile("offerings")
        .then(offerings=>res.send(offerings))
        .catch(next)
})

const port = process.env.PORT || 3000

db.sync().then(()=>app.listen(port, ()=> console.log(`listening on port ${port}`)))