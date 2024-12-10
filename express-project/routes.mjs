import { Express } from "express"
import { PostsController } from "./controllers/PostsController.mjs"
import { AssetsController } from "./controllers/AssetController.mjs"

/**
 * Register all app routes
 * 
 * @param {Express} app App to register routes to
 * @param {PostsController} posts Posts controller
 * @param {AssetsController} assets Assets controller
 */
export function registerRoutes(app, posts, assets) {
  // == Posts ==
  app.route("posts/")
    .get(posts.searchPosts)
    .post(posts.createPost)

  app.route("posts/:id")
    .delete(posts.deletePost)
    .get(posts.getPost)
    .put(posts.editPost)

  // == Images ==
  app.route("images/:id")
    .get(assets.findAsset)

  // == Users ==
}