import ex from "express"
import { PostsController } from "./controllers/PostsController.mjs"
import { AssetsController } from "./controllers/AssetController.mjs"

/**
 * Register all app routes
 * 
 * @param {ex.Express} app App to register routes to
 * @param {PostsController} posts Posts controller
 * @param {AssetsController} assets Assets controller
 */
export function registerRoutes(app, posts, assets) {
  // == Posts ==
  app.route("/posts/")
    .get((req, res) => posts.searchPosts(req, res))
    .post((req, res) => posts.createPost(req, res))

  app.route("/posts/:id")
    .delete((req, res) => posts.deletePost(req, res))
    .get((req, res) => posts.getPost(req, res))
    .put((req, res) => posts.editPost(req, res))

  // == Images ==
  app.route("/images/:id")
    .get((req, res) => assets.findAsset(req, res))

  // == Users ==
}