import { v7 } from "uuid"

function dateTimeNow() {
  return new Date()
}

/**
 * Posts service, modifies, gets, queries and deletes posts.
 */
export default class PostsService {
  #posts = {}
  
  constructor() {
  
  }

  /**
   * Searches posts with a provided array of search expressions from 
   * tags-parser.js
   * 
   * @param {any[]} searchExpr Array of search expressions. Expressions 
   *                           must be objects with the testPost(post) => boolean method.
   * 
   * @returns {object[]} An array of posts matching the search
   */
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

    let sortTag = this.#findSortTag(searchExpr)
    if (sortTag) {
      let sortType = sortTag.fieldValue

      if (sortType == 'modified') {
        this.#sortBy(result, p => p.modified_date)
      } else if (sortType == 'date' || sortType == 'upload') {
        this.#sortBy(result, p => p.upload_date)
      }
    }
    
    return result
  }

  #sortBy(arr, getter) {
    return arr.sort((a, b) => getter(a).getTime() - getter(b).getTime())
  }

  #findSortTag(searchExpr) {
    return searchExpr.find((v) => v.fieldName == "sort" || v.fieldName == "order")
  }

  /**
   * Finds a post by its UUID
   * @param id Post UUID
   * @returns Found post, or undefined, if not found
   */
  async getPostById(id) {
    return this.#posts[id]
  }

  /**
   * Modifies a post with the specified ID to have the specified postData
   * as its data
   * 
   * @param {any} id UUID of the post to modify
   * @param {any} postData New post data
   * 
   * @returns The new, modified, post
   */
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

  /**
   * Generates a new UUID and creates a new post
   * @param {any} postData Post data
   * @returns Created post, with ID
   */
  async createPost(postData) {
    let post = {
      id: v7(),

      content: postData.content,
      author_id: postData.author_id,

      tags: postData.tags,

      modified_date: dateTimeNow(),
      upload_date: dateTimeNow()
    }
  
    this.#posts[post.id] = post
    return post
  }

  /**
   * Deletes a post by its UUID
   * @param {any} postId Post UUID
   */
  async deletePost(postId) {
    delete this.#posts[postId]
  }
}