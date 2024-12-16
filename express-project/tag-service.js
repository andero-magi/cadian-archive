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

    await PostTag.destroy({where: {post_id: post.id}})

    for (let tagName of tagNames) {
      let tagData = this.getResolvedTag(tagName)
      if (tagData == null) {
        continue
      }

      let link = await PostTag.create({
        post_id: postId,
        tag_id: tagData.id
      })
      await link.save()
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

    for (let pt of found) {
      let tag = this.getTagData(pt.id)
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

  async getTagData(tagName) {
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
}