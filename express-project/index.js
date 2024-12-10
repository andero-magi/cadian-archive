import dotenv from "dotenv"
import cors from "cors"
import express, { json } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerDoc from './docs/swagger.json'
import PostsService from "./post-service"
import ImagesService from "./image-service"
import TagService from "./tag-service"
import { registerRoutes } from "./routes.mjs"
import { PostsController } from "./controllers/PostsController.mjs"
import { AssetsController } from "./controllers/AssetController.mjs"

dotenv.config()

const app = express()

const posts = new PostsService()
const images = new ImagesService()
const tagService = new TagService()

const port = process.env.PORT ?? 8080
const host = process.env.HOST ?? "localhost"

const postsC = new PostsController(posts, tagService, images)
const imagesC = new AssetsController(images)

registerRoutes(app, postsC, imagesC)

// Set up server
app.use(cors())
app.use('/docs', serve, setup(swaggerDoc))
app.use(json())

app.listen(port, () => console.log(`URL: http://${host}:${port}/docs`))