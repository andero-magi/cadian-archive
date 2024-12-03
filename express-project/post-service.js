const UUID       = require("uuid")

function dateTimeNow() {
  return new Date()
}

class PostsService {
  #posts = {}
  
  constructor() {
  
  }

  async searchPosts(searchExpr) {
    let result = []

    outer: for (let uuid in this.#posts) {
      let post = this.#posts[uuid]

      for (let expr of searchExpr) {
        if (expr.testPost(post)) {
          continue
        }
        continue outer
      }

      result.push(post)
    }

    let sortTag = this.findSortTag(searchExpr)
    if (sortTag) {
      let sortType = sortTag.fieldValue

      if (sortType == 'modified') {
        this.sortBy(result, p => p.modified_date)
      } else if (sortType == 'date' || sortType == 'upload') {
        this.sortBy(result, p => p.upload_date)
      }
    }
    
    return result
  }

  sortBy(arr, getter) {
    return arr.sort((a, b) => getter(b).getTime() - getter(a).getTime())
  }

  findSortTag(searchExpr) {
    return searchExpr.find((v) => v.fieldName == "sort" || v.fieldName == "order")
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
    let existing = await this.getPostById(id)

    let post = {
      id: id,

      content: postData.content,
      author_id: postData.author_id,

      tags: postData.tags,

      upload_date: existing?.upload_date,
      modified_date: dateTimeNow()
    }
  
    this.#posts[id] = post
    return post
  }
  
  async createPost(postData) {
    let post = {
      id: UUID.v7(),

      content: postData.content,
      author_id: postData.author_id,

      tags: postData.tags,

      modified_date: dateTimeNow(),
      upload_date: dateTimeNow()
    }
  
    this.#posts[post.id] = post
    return post
  }
  
  async deletePost(postId) {
    delete this.#posts[postId]
  }
}

module.exports = PostsService