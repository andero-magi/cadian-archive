const port = 8080
const app = require('express')()
const bodyParser = require("body-parser")
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = require('./docs/swagger.json')
const UUID = require("uuid")

const jsonParser = bodyParser.json()

const posts = {}
createTests()

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.post("/posts", jsonParser, (req, res) => {
    let id = UUID.v7()
    let j = req.body

    if (j == null) {
        res.status(400).send({error: "No body"})
        return
    }

    console.log(j)

    let data = {
        id: id,
        content: j.content,
        tags: j.tags
    }

    posts[id] = data
    res.status(201).send()
})

app.get("/posts", (req, res) => {
    let arr = []
    for (let key in posts) {
        arr.push(posts[key])
    }
    res.status(200).send(arr)
})

app.get("/posts/:id", (req, res) => {
    let id = req.params.id
    if (id == null) {
        res.status(400).send({error: `No UUID provided`})
        return
    }

    let post = posts[id]

    if (post == null) {
        res.status(404).send({error: `Post with UUID ${id} not found`})
        return 
    }

    return res.status(200).send(post)
})

app.delete("/posts/:id", (req, res) => {
    let id = req.params.id
    if (id == null) {
        res.status(400).send({error: `No UUID provided`})
        return
    }

    let post = posts[id]

    if (post == null) {
        res.status(404).send({error: `Post with UUID ${id} not found`})
        return 
    }

    delete posts[id]
    res.status(200).send()
})

app.listen(port, () => console.log(`URL: http://localhost:${port}/docs`))

function createTests() {
    for (let i = 0; i < 25; i++) {
        let id = UUID.v7()
        let content = `Content of ${i}`
        let tags = []

        let tagCount = Math.floor(Math.random() * 10)
        for (let j = 0; j < tagCount; j++) {
            tags.push(`Tag ${j}`)
        }

        posts[id] = {
            id: id,
            content: content,
            tags: tags
        }
    }
}