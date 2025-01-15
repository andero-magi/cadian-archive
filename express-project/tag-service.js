import Sequelize, { Op } from "@sequelize/core"
import { Post } from "./models/Post.model.js"
import { PostTag } from "./models/PostTag.model.js"
import { Tag } from "./models/Tag.model.js"

export default class TagService {
  #tags = {}

  constructor() {

  }

  async clearLinkedTags(postId) {
    await PostTag.destroy({where: {post_id: postId}})
  }

  /**
   * Find posts by the tags linked to them
   * @param {TagSearch[]} searchTags 
   * @param {number} [page=0] Page number starting at 0
   * @param {number} [pageSize=20] Page size
   * @returns {Promise<Set<string>>} A set of post IDs that match the query
   */
  async findPostsByLinkedTags(searchTags, page = 0, pageSize = 20) {
    let andOps = []

    // If there are tags to look for, then combine the 
    if (searchTags.length > 0) {
      let positiveTags = []
      let negatedTags = []
  
      for (let s of searchTags) {
        if (s.negated) {
          negatedTags.push(s.tagName)
        } else {
          positiveTags.push(s.tagName)
        }
      }
  
      if (negatedTags.length > 0) {
        andOps.push({tag_id: {[Op.notIn]: negatedTags}})
      }
      if (positiveTags.length > 0) {
        andOps.push({tag_id: {[Op.in]: positiveTags}})
      }
    }

    let matching
    
    if (andOps.length > 0) {
      matching = await PostTag.findAll(
        {
          where: {[Op.and]: andOps},
          // attributes: [
          //   [Sequelize.fn("DISTINCT")]
          // ]
        }
      )
    } else {
      matching = await PostTag.findAll()
    }

    let postIds = new Set()
    for (let m of matching) {
      postIds.add(m.post_id)
    }

    return postIds
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
      await PostTag.destroy({where: {post_id: postId}})
    } else {
      throw "Post id undefined"
    }

    for (let tagName of tagNames) {
      let tagData = await this.resolveTag(tagName)

      if (!tagData) {
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
      let tag = await this.getTagData(pt.tag_id)
      if (!tag) {
        continue
      }

      tagData.push(tag)
    }

    return tagData
  }

  async resolveTag(tagName) {
    let t = await this.getTagData(tagName)
    if (!t) {
      return null
    }

    if (!t.parent_id) {
      return t
    }
    if (!t.is_alias) {
      return t
    }

    return await this.getTagData(t.parent_id)
  }

  async addTag(tagName) {
    let existing = await this.getTagData(tagName)
    if (existing) {
      return existing
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
    let cached = this.#tags[tagName]

    if (cached) {
      return cached
    }

    let found = await Tag.findOne({where: {id: tagName}})

    if (!found) {
      return null
    }

    this.#tags[found.id] = found
    return found
  }

  async validateTag(tagName) {
    let found = await this.getTagData(tagName)

    if (found) {
      return true
    }

    return false
  }

  async getAllTags() {
    let tagsArray = await Tag.findAll({})
    for (let t of tagsArray) {
      this.#tags[t.id] = t
    }
    return tagsArray
  }
}