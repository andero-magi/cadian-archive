import ex from "express"
import { PostsController } from "./controllers/PostsController.mjs"
import { AssetsController } from "./controllers/AssetController.mjs"
import { TagsController } from "./controllers/TagsController.mjs"

/**
 * Register all app routes
 * 
 * @param {ex.Express} app App to register routes to
 * @param {PostsController} posts Posts controller
 * @param {AssetsController} assets Assets controller
 * @param {TagsController} tags Tags controller
 */
export function registerRoutes(app, posts, assets, users, tags) {
  // == Posts ==
  app.route("/posts/")
    .get(async (req, res) => await posts.searchPosts(req, res))
    .post(async (req, res) => await posts.createPost(req, res))

  app.route("/posts/:id")
    .delete(async (req, res) => await posts.deletePost(req, res))
    .get(async (req, res) => await posts.getPost(req, res))
    .put(async (req, res) => await posts.editPost(req, res))

  // == Images ==
  app.route("/images/:id")
    .get(async (req, res) => await assets.findAsset(req, res))

  // == Tags ==
  app.route("/tags")
    .get(async (req, res) => await tags.listAllTags(req, res))

  app.route("/tags/:name")
    .post(async (req, res) => await tags.createNewTag(req, res))
    .get(async (req, res) => await tags.getTagData(req, res))

  // == Users ==
  app.route("/users")
  .post((req, res) => users.createUser(req, res))

  app.route("/users/:id")
   .put((req, res) => users.updateUser(req, res))
   .get((req, res) => users.getUser(req, res))
   .delete((req, res) => users.deleteUser(req, res))

   app.route("/login")
  .post((req, res) => users.loginUser(req, res));

  app.route("/signup")
  .post((req, res) => users.createUser(req, res));
}