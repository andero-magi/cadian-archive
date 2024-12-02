const port = 8080

const express    = require('express')
const swaggerUI  = require('swagger-ui-express')
const swaggerDoc = require('./docs/swagger.json')
const yup        = require("yup")
const UUID       = require("uuid")
const PostsService = require("./post-service")
const ImagesService = require("./image-service")
const TagService = require("./tag-service")

const app = express()

// Define post schemas
const shape = yup.object().shape({
  tags: yup.array().of(yup.string()).required(),
  author_id: yup.number().required(),
  content: yup.array().of(yup.object().shape({
    type: yup.string().oneOf(['imageref', 'imagedata', 'section', 'header', 'title']),
    data: yup.string()
  }))
})

const posts = new PostsService()
const images = new ImagesService()

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

  await processImages(j)

  let created = await posts.createPost(j)
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

  let existing = await posts.getPostById(id)
  if (existing == null) {
    res.status(404).send({error: `No post with ID ${id} found`})
    return
  }

  let newObj = await posts.modifyPost(id, j)
  res.status(200).send(newObj)
})

// Get all posts
app.get("/posts", async (req, res) => {
  res.status(200).send(await posts.listPosts())
})

// Get specific post
app.get("/posts/:id", async (req, res) => {
  let id = getIdParam(req, res)
  if (id == null) {
    return
  }

  let post = await posts.getPostById(id)

  if (post == null) {
    res.status(404).send({error: `Post with UUID ${id} not found`})
    return 
  }

  return res.status(200).send(post)
})

// Delete post
app.delete("/posts/:id", async (req, res) => {
  let id = getIdParam(req, res)
  if (id == null) {
    return
  }

  let post = await posts.getPostById(id)

  if (post == null) {
    res.status(404).send({error: `Post with UUID ${id} not found`})
    return 
  }

  await posts.deletePost(id)
  res.status(200).send()
})

// Get images stored by the images service
app.get("/images/:id", async (req, res) => {
  let id = getIdParam(req, res)
  if (id == null) {
    return
  }

  let imgData = await images.findImage(id)
  if (imgData == null) {
    res.status(404).send({error: `Image with ID ${id} not found`})
  }

  res.contentType = "image/jpeg"
  return res.status(200).send(imgData)
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
 * Process 'imagedata' content values in the post data and upload
 * them to the internal service, replacing the imagedata values
 * with imagerefs.
 * 
 * @param {*} j Post data
 */
async function processImages(j) {
  let contentArray = j.content
  for (let i = 0; i < contentArray.length; i++) {
    let c = contentArray[i]
    if (c.type != 'imagedata') {
      continue
    }

    let uploadedId = await images.uploadImage(c.data)
    c.data = uploadedId
    c.type = "imageref"
  }
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
    let content = {type: 'paragraph', data: `Content of ${i}`}
    let tags = []

    let tagCount = Math.floor(Math.random() * 10)
    for (let j = 0; j < tagCount; j++) {
      tags.push(`Tag ${j}`)
    }

    posts.createPost({
      content: content,
      author_id: Math.floor(100000 * Math.random()),
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