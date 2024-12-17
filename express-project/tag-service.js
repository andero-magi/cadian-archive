import { Post } from "./models/Post.model.js"
import { PostTag } from "./models/PostTag.model.js"
import { Tag } from "./models/Tag.model.js"

export default class TagService {
  #tags = {}

  constructor() {

  }

  /**
   * 
   * @param {string[]} tagNames 
   * @param {Post} post
   */
  async linkTags(tagNames, post) {
    let postId = post.id
    let links = []

    if (postId != undefined) {
      await PostTag.destroy({where: {post_id: post.id}})
      console.log("------------ Destroying some post tags")
    } else {
      throw "Post id undefined"
    }

    for (let tagName of tagNames) {
      let tagData = await this.getResolvedTag(tagName)
      if (tagData == null) {
        continue
      }

      let link = await PostTag.create({
        post_id: postId,
        tag_id: tagData.id
      })
      await link.save()

      console.log("Created post tag:")
      console.log(link)

      links.push(link)
    }

    return links
  }

  /**
   * 
   * @param {Post} post 
   * @returns {Tag[]}
   */
  async getLinkedTags(post) {
    let found = await PostTag.findAll({where: {post_id: post.id}})
    let tagData = []

    console.log(found)

    for (let pt of found) {
      let tag = await this.getTagData(pt.tag_id)
      if (tag == null) {
        continue
      }

      tagData.push(tag)
    }

    return tagData
  }

  async getResolvedTag(tagName) {
    let t = this.getTagData(tagName)
    if (t == null) {
      return null
    }

    if (t.parent_id == null) {
      return t
    }

    if (!t.is_alias) {
      return t
    }

    return await this.getTagData(t.parent_id)
  }

  async addTag(tagName) {
    let existing = this.getTagData(tagName)
    if (existing != null) {
      return
    }

    let tagData = await Tag.create({
      id: tagName,
      is_alias: false,
      parent_id: null
    })
    await tagData.save()

    this.#tags[tagData.id] = tagData
    return tagData
  }

  /**
   * 
   * @param {*} tagName 
   * @returns {Promise<Tag>}
   */
  async getTagData(tagName) {
    console.log("tag name: " + tagName + ", type=" + typeof tagName)
    let cached = this.#tags[tagName]
    if (cached != null) {
      return cached
    }

    let found = Tag.findOne({where: {id: tagName}})
    if (found == null) {
      return null
    }

    this.#tags[found.id] = found
    return found
  }

  async validateTag(tagName) {
    return this.getTagData(tagName) != null
  }

  async createNewTag(tagName) {
    let created = await Tag.create({id: tagName})
    await created.save()

    this.#tags[tagName] = created

    return created
  }

  async getAllTags() {
    let tagsArray = await Tag.findAll({})
    for (let t of tagsArray) {
      this.#tags[t.id] = t
    }
    return tagsArray
  }
}