import dotenv from "dotenv"
import cors from "cors"
import express, { json } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerDoc from './docs/swagger.json' with {type: "json"}
import PostsService from "./post-service.js"
import ImagesService from "./image-service.js"
import TagService from "./tag-service.js"
import {UserService} from "./user-service.js"
import { UsersController } from "./controllers/UsersController.mjs"
import { registerRoutes } from "./routes.mjs"
import { PostsController } from "./controllers/PostsController.mjs"
import { AssetsController } from "./controllers/AssetController.mjs"
import { initDatabase, getSequelize, sync} from "./db-service.js"
import { registerModels } from "./models/models.js"

dotenv.config()

const app = express()

await initDatabase()
let sql = getSequelize()

registerModels(sql)
sync()

const posts = new PostsService()
const images = new ImagesService()
const tagService = new TagService()
const userService = new UserService()


const port = process.env.PORT ?? 8080
const host = process.env.HOST ?? "localhost"

const postsC = new PostsController(posts, tagService, images)
const usersC = new UsersController(userService)
const imagesC = new AssetsController(images)

// Set up server
app.use(cors())
app.use('/docs', serve, setup(swaggerDoc))
app.use(json())

registerRoutes(app, postsC, imagesC, usersC)

/**
 * Get base URL
 * @param {Request} req 
 */
function getBaseUrl(req) {
  return (req.connection && req.connection.encrypted
    ? "https" : "http") + `://${req.headers.host}`
}



/**KERDO ABOMINATION **/



app.listen(port, () => console.log(`URL: http://${host}:${port}/docs`))

