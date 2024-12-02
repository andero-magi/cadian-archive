const UUID       = require("uuid")

class PostsService {
  #posts = {}
  
  constructor() {
  
  }
  
  async listPosts() {
    let arr = []
    for (let key in this.#posts) {
      arr.push(this.#posts[key])
    }
    return arr
  }
  
  async getPostById(id) {
    return this.#posts[id]
  }
  
  async modifyPost(id, postData) {
    let post = {
      id: id,
      content: postData.content,
      author_id: postData.author_id,
      tags: postData.tags
    }
  
    this.#posts[id] = postData
    return post
  }
  
  async createPost(postData) {
    let post = {
      id: UUID.v7(),
      content: postData.content,
      author_id: postData.author_id,
      tags: postData.tags
    }
  
    this.#posts[post.id] = post
    return post
  }
  
  async deletePost(postId) {
    delete this.#posts[postId]
  }
}

module.exports = PostsService