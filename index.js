require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT
const fruits = require("./fruits.json")
const logger = require("./logger.js")

// middleware
app.use(cors())
app.use(express.json())
app.use(logger)

app.get("/", (req, res) => {
    res.send("Welcome to the Fruit API")
})

app.get("/fruits", (req, res) => {
    res.send(fruits)
})

app.get("/fruits/:name", (req, res) => {
    const name = req.params.name.toLowerCase()
    const ff = fruits.filter((f) => f.name.toLowerCase() == name)
    ff.length === 0 ? res.status(404).send("Fruit not recognized") : res.send(ff[0]) // 404: Not Found
})

app.post("/fruits", (req, res) => {
    if(!req.body || !req.body.name){
        return res.status(400).send("Fruit name is required")} // 400: Bad Request
    try{
        const fruit = fruits.find((f) => f.name.toLowerCase == req.body.name.toLowerCase())
        if(fruit != undefined){
            return res.status(409).send("That fruit exists") // 409: Conflict
        }
        const ids = fruits.map((f) => f.id)
        let maxId = Math.max(...ids) // spread function passes in all indices as if they were separated by commas
        req.body.id = maxId + 1
        fruits.push(req.body)
        res.status(201).send("Fruit created")} // 201: Created
    catch(e){
        console.error(e)}
        res.status(500).send("An error occurred") // 500: Internal Server Error
})

app.patch("/fruits/:name", (req,res) => {
    const fruit = fruits.find((f) => f.name.toLowerCase() == req.params.name.toLowerCase())
    const newFruitName = req.body.name
    if(fruit == undefined){
        res.status(404).send("No fruit by that name")
    }else{
        fruit.name = newFruitName
        res.status(200).send(fruit)
    }
})

app.delete("/fruits/:name", (req, res) => {
    const name = req.params.name.toLowerCase()
    const fruitIndex = fruits.findIndex((f) => f.name.toLowerCase() == name)
    console.log(fruitIndex)
    if(fruitIndex == -1){
        res.status(404).send("Fruit not found")
    }else{
        fruits.splice(fruitIndex,1)
        res.sendStatus(204)
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})