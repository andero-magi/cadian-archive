const port = 8080

const express    = require('express')
const swaggerUI  = require('swagger-ui-express')
const swaggerDoc = require('./docs/swagger.json')
const yup        = require("yup")
const UUID       = require("uuid")

const app = express()

// Post service, replace with DB later
class PostsService {
  #posts = {}

  constructor() {

  }

  listPosts() {
    let arr = []
    for (let key in this.#posts) {
      arr.push(this.#posts[key])
    }
    return arr
  }

  getPostById(id) {
    return this.#posts[id]
  }

  modifyPost(id, postData) {
    let post = {
      id: id,
      content: postData.content,
      tags: postData.tags
    }

    this.#posts[id] = postData
    return post
  }

  createPost(postData) {
    let post = {
      id: UUID.v7(),
      content: postData.content,
      tags: postData.tags
    }

    this.#posts[post.id] = post
    return post
  }

  deletePost(postId) {
    delete this.#posts[postId]
  }
}

// Define post schema
const shape = yup.object().shape({
  tags: yup.array().of(yup.string()).required(),
  content: yup.string().required()
})

const posts = new PostsService()

// Create test posts
createTests()

// =============================================
// - API handling
// =============================================

// App use calls
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use(express.json())

// Create new post
app.post("/posts", async (req, res) => {
  let j = await tryValidate(req, res)

  if (j == null) {
    return
  }

  let created = posts.createPost(j)
  res.status(201).send(created)
})

// Update existing post
app.put("/posts/:id", async (req, res) => {
  let j = await tryValidate(req, res)
  if (j == null) {
    return
  }

  let id = getIdParam(req, res)
  if (id == null) {
    return
  }

  let existing = posts.getPostById(id)
  if (existing == null) {
    res.status(404).send({error: `No post with ID ${id} found`})
    return
  }

  let newObj = posts.modifyPost(id, j)
  res.status(200).send(newObj)
})

// Get all posts
app.get("/posts", (req, res) => {
  res.status(200).send(posts.listPosts())
})

// Get specific post
app.get("/posts/:id", (req, res) => {
  let id = getIdParam(req, res)
  if (id == null) {
    return
  }

  let post = posts.getPostById(id)

  if (post == null) {
    res.status(404).send({error: `Post with UUID ${id} not found`})
    return 
  }

  return res.status(200).send(post)
})

// Delete post
app.delete("/posts/:id", (req, res) => {
  let id = getIdParam(req, res)
  if (id == null) {
    return
  }

  let post = posts.getPostById(id)

  if (post == null) {
    res.status(404).send({error: `Post with UUID ${id} not found`})
    return 
  }

  posts.deletePost(id)
  res.status(200).send()
})

// Start web server
app.listen(port, () => console.log(`URL: http://localhost:${port}/docs`))

// =============================================
// - Helper functions
// =============================================

/**
 * Attempt to validate the body of the request. If validated 
 * successfully, the validated post is returned, otherwise, null
 * is returned and a 400 response sent.
 * 
 * @param {Request} req Request
 * @param {Response} res Response
 * 
 * @returns Validated request, or null
 */
async function tryValidate(req, res) {
  let j = req.body

  try {
    j = await shape.validate(j)
  } catch (err) {
    let errors = err.errors
    let errString

    if (errors == null || errors.length < 1) {
      errString = "Invalid data"
    } else {
      errString = errors[0]
    }

    res.status(400).send({error: errString})
    return null
  }

  return j
}

/**
 * Attempt to get the 'id' parameter and validate it. If 
 * validation fails, null is returned, and an erroneous code
 * sent as response, otherwise the ID is returned.
 * 
 * @param {Request} req Request
 * @param {Response} res Response
 * 
 * @returns The validated ID, or null
 */
function getIdParam(req, res) {
  let id = req.params.id

  if (id == null) {
    res.status(400).send({error: "No ID"})
    return null
  }

  try {
    UUID.parse(id)
  } catch (err) {
    res.status(400).send({error: "Invalid UUID"})
    return null
  }

  return id
}

/**
 * Creates test posts
 */
function createTests() {
  for (let i = 0; i < 25; i++) {
    let content = `Content of ${i}`
    let tags = []

    let tagCount = Math.floor(Math.random() * 10)
    for (let j = 0; j < tagCount; j++) {
      tags.push(`Tag ${j}`)
    }

    posts.createPost({
      content: content,
      tags: tags
    })
  }
}

/**
 * Get base URL
 * @param {Request} req 
 */
function getBaseUrl(req) {
  return (req.connection && req.connection.encrypted
    ? "https" : "http") + `://${req.headers.host}`
}