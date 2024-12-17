import dotenv from "dotenv"
import cors from "cors"
import express, { json } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerDoc from './docs/swagger.json' with {type: "json"}
import PostsService from "./post-service.js"
import ImagesService from "./image-service.js"
import TagService from "./tag-service.js"
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

const port = process.env.PORT ?? 8080
const host = process.env.HOST ?? "localhost"

const postsC = new PostsController(posts, tagService, images)
const imagesC = new AssetsController(images)

// Set up server
app.use(cors())
app.use('/docs', serve, setup(swaggerDoc))
app.use(json())

registerRoutes(app, postsC, imagesC)

/**
 * Get base URL
 * @param {Request} req 
 */
function getBaseUrl(req) {
  return (req.connection && req.connection.encrypted
    ? "https" : "http") + `://${req.headers.host}`
}



/**KERDO ABOMINATION **/

/*
*Post
*Create account/ return 201 and 400
*/

const userService = new UserService

app.post("/users", (req,res) => {
  if (!req.body.username ||!req.body.password || !req.body.email)  {
    return res.status(400).send({error: "Invalid user data"});  
  }
  let user = {
    id: userService.generateUserId(),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }
  users.push(user);
  res.status(201).send(user);
})
  
/*let users = [];

/*
*PUT
*Update user info (200, 400, 401)
*/

let mock = userService.createUser();

app.put("/users/:id", (req,res) => {

  if (req.params.id == null) {
    return res.status(400).send({error: "Invalid user ID"});  
  }

  let id = req.params.id;
  let existingUser = userService.getUserById(id);
  if (!existingUser) {
    return res.status(404).send({error: "Id does not exist"});
  }

  if (!req.body.username ||!req.body.password || !req.body.email)  {
    return res.status(400).send({error: "Invalid user data"});
  }  

    let user = userService.modifyUser(req.params.id, req.body.username, req.body.password)
    
    res.status(200).send(user);
  });

/*
*GET
*Get user by ID (200, 404)
*/
app.get("/users/:id", (req, res) => {
  
  if (req.params.id == null){
    return
  }

  let user = userService.getUserById(req.params.id);
  if (user == null){
    res.status(404).send({error: `User with this ${req.params.id} doesnt exist`});
    return
  }
  return res.status(200).send(user);
})

/*
*DELETE USER BY ID
*RETURN 200/404
*/
/*
app.delete("/users/:id", async (req, res) => {
  if (req.params.id == null){
    return 
  }
  
  let id = req.params.id
  let user = await userService.getUserById(id);
  if (user == null){
    res.status(404).send({error: `User with this ${req.params.id} doesnt exist`});
    return
  }

  await users.deleteUser(id)
  res.status(200).send()
})
*/


app.listen(port, () => console.log(`URL: http://${host}:${port}/docs`))

