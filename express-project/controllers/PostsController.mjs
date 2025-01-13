import express from "express"
import yup from "yup"
import { getIdParam } from "../utils.mjs"
import PostsService from "../post-service.js"
import ImagesService from "../image-service.js"
import TagService from "../tag-service.js"
import * as tagsParser from "../tags-parser.js"
import { Post } from "../models/Post.model.js"
import { getServer } from "../index.js"
import { filterPosts } from "../search.js"

// Define post schemas
export const PostShape = yup.object().shape({
  tags: yup.array().of(yup.string()).required(),
  author_id: yup.string().required(),
  content: yup.array().of(yup.object().shape({
    type: yup.string().oneOf(['imageref', 'imagedata', 'section', 'header', 'title']),
    data: yup.string()
  }))
})

export class PostsController {
  #posts
  #tagService
  #images
  
  /**
   * Create the posts controller
   * @param {PostsService} posts 
   * @param {TagService} tags 
   * @param {ImagesService} images 
   */
  constructor(posts, tags, images) {
    this.#posts = posts
    this.#tagService = tags
    this.#images = images
  }
  
  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async searchPosts(req, res) {
    let search = req.query['search'] ?? ''
    let searchExpr
  
    if (search == '') {
      searchExpr = []
    } else {
      searchExpr = tagsParser.parseTags(search)
    }

    let tagSearches = searchExpr.filter(p => p instanceof tagsParser.TagSearch)
    let matchingIds = await this.#tagService.findPostsByLinkedTags(tagSearches)
    let posts = []
    
    for (let postId of matchingIds) {
      let post = await this.#posts.getPostById(postId)
      if (post == null) {
        continue
      }

      posts.push(post)
    }

    posts = (await filterPosts(this.#tagService, posts, searchExpr))
      .map(pt => ({
        id: pt.post.id,
        author_id: pt.post.author_id,
        tags: pt.tags,
        content: pt.post.content,
        modified_date: pt.post.modified_date,
        upload_date: pt.post.upload_date
      }))

    res.status(200).send(posts)
  }

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async createPost(req, res) {
    let j = await tryValidate(req, res)
    if (j == null) {
      return
    }

    if (!(await processImages(req, res, this.#images, j.content))) {
      return
    }

    await ensureTagsExist(this.#tagService, j.tags)

    let created = await this.#posts.createPost(j)

    await processTags(j.tags, created, this.#tagService)

    res.status(201).send(created)
  }

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async deletePost(req, res) {
    let id = getIdParam(req, res)
    if (id == null) {
      return
    }
  
    let post = await this.#posts.getPostById(id)
  
    if (post == null) {
      res.status(404).send({error: `Post with UUID ${id} not found`})
      return 
    }

    let content = post.content
    for (let sect of content) {
      if (sect.type != "imageref") {
        continue
      }

      await this.#images.deleteImage(sect.data)
    }

    await this.#tagService.clearLinkedTags(post.id)
    await this.#posts.deletePost(id)

    res.status(200).send({message: `Successfully deleted post ${id}`})
  }

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async getPost(req, res) {
    let id = getIdParam(req, res)
    if (id == null) {
      return
    }
  
    let post = await this.#posts.getPostById(id)
  
    if (post == null) {
      res.status(404).send({error: `Post with UUID ${id} not found`})
      return 
    }
  
    return res.status(200).send(await toApiObject(getBaseUrl(req), post, this.#tagService))
  }

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async editPost(req, res) {
    let j = await tryValidate(req, res)
    if (j == null) {
      return
    }
  
    let id = getIdParam(req, res)
    if (id == null) {
      return
    }
  
    let existing = await this.#posts.getPostById(id)
    if (existing == null) {
      res.status(404).send({error: `No post with ID ${id} found`})
      return
    }
  
    if (!(await processImages(req, res, this.#images, existing.content))) {
      return
    }

    await ensureTagsExist(this.#tagService, j.tags)
    await processTags(j.tags, existing, this.#tagService)
  
    let newObj = await this.#posts.modifyPost(id, j)
    res.status(200).send(await toApiObject(getBaseUrl(req), newObj, this.#tagService))
  }
}

/**
 * 
 * @param {TagService} tagService 
 * @param {string[]} tags
 */
async function ensureTagsExist(tagService, tags) {
  if (tags == null || tags.length < 1) {
    return
  }

  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i]
    let valid = await tagService.validateTag(tag)
    
    if (valid) {
      continue
    }

    await tagService.addTag(tag)
  }
}

/**
 * Maps the post data to an API return value. Gets all tags linked to the
 * post and attaches their names to the object with a 'tags' property.
 * 
 * @param {Post} post 
 * @param {TagService} tagService 
 */
async function toApiObject(baseUrl, post, tagService) {
  let tags = await tagService.getLinkedTags(post)
  let tagNameArray = tags.map(t => t.id)

  let content = post.content

  return {
    id: post.id,
    author_id: post.author_id,
    modified_date: post.modified_date,
    upload_date: post.upload_date,
    content: content,
    tags: tagNameArray
  }
}

/**
 * Gets the base URL used for the request.
 * @param {express.Request} req Request
 * @returns {string} Base URL
 */
function getBaseUrl(req) {
  let prot = req.protocol
  let host = req.host
  
  let server = getServer()
  let port = server.address().port

  return `${prot}://${host}:${port}`
}

/**
 * Attempt to validate the body of the request. If validated 
 * successfully, the validated post is returned, otherwise, null
 * is returned and a 400 response sent.
 * 
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 * 
 * @returns Validated request, or null
 */
async function tryValidate(req, res) {
  let j = req.body

  console.log(j)
  console.log(typeof j)
  console.log(j.author_id)

  try {
    j = await PostShape.validate(j)
  } catch (err) {
    let errors = err.errors
    let errString

    if (errors == null || errors.length < 1) {
      errString = "Invalid data"
    } else {
      errString = errors[0]
    }

    res.status(400).send({error: errString})
    return null
  }

  return j
}

/**
 * Process 'imagedata' content values in the post data and upload
 * them to the internal service, replacing the imagedata values
 * with imagerefs.
 * 
 * @param {express.Request} req Request
 * @param {express.Response} res Request
 * @param {any[]} j content array
 * @param {ImagesService} images 
 * @returns {Promise<boolean>}
 */
async function processImages(req, res, images, contentArray) {
  if (contentArray == null) {
    return
  }

  for (let i = 0; i < contentArray.length; i++) {
    let c = contentArray[i]
    if (c.type != 'imagedata') {
      continue
    }

    const prefix = "data:"
    const suffix = ";base64,"

    let data = String(c.data)
    let idx = data.indexOf(suffix)

    if (!data.startsWith(prefix) || idx == -1) {
      req.status(400).send({error: "imagedata is not a base64 encoded string"})
      return false
    }

    let mimeType = data.substring(prefix.length, idx)
    if (!mimeType.startsWith("image/")) {
      req.status(400).send({error: "imagedata does not have image mime type"})
      return false
    }

    let base64Data = data.substring(idx + suffix.length)
    let imgId = await images.uploadImage(base64Data, mimeType)

    let ndata = {
      type: "imageref",
      data: imgId
    }

    contentArray[i] = ndata
  }

  return true
}

/**
 * 
 * @param {string[]} tags
 * @param {Post} post 
 * @param {TagService} tagService 
 */
async function processTags(tags, post, tagService) {
  await tagService.linkTags(tags, post)
}