import express from "express"
import yup from "yup"
import { getIdParam } from "../utils.mjs"
import PostsService from "../post-service.js"
import ImagesService from "../image-service.js"
import TagService from "../tag-service.js"
import * as tagsParser from "../tags-parser.js"
import { Post } from "../models/Post.model.js"

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

    let postArray = await this.#posts.searchPosts(searchExpr)
    let arr = []

    for (let p of postArray) {
      let api = await toApiObject(p, this.#tagService)
      arr.push(api)
    }
    
    res.status(200).send(arr)
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

    await ensureTagsExist(this.#tagService, j.tags)
    await processImages(this.#images, j.content)
  
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
  
    await this.#posts.deletePost(id)
    res.status(200).send({message: "Successfully deleted post"})
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
  
    return res.status(200).send(await toApiObject(post, this.#tagService))
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
  
    await ensureTagsExist(this.#tagService, j.tags)
    await processImages(this.#images, existing.content)
    await processTags(j.tags, existing, this.#tagService)
  
    let newObj = await this.#posts.modifyPost(id, j)
    res.status(200).send(await toApiObject(newObj, this.#tagService))
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
async function toApiObject(post, tagService) {
  let tags = await tagService.getLinkedTags(post)
  let tagNameArray = tags.map(t => t.id)

  return {
    id: post.id,
    author_id: post.author_id,
    modified_date: post.modified_date,
    upload_date: post.upload_date,
    content: post.content,
    tags: tagNameArray
  }
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
 * @param {any[]} j content array
 * @param {ImagesService} images 
 */
async function processImages(images, contentArray) {
  if (contentArray == null) {
    return
  }

  for (let i = 0; i < contentArray.length; i++) {
    let c = contentArray[i]
    if (c.type != 'imagedata') {
      continue
    }

    let uploadedId = await images.uploadImage(c.data, c.image_type ?? "jpeg")
    c.data = uploadedId
    c.type = "imageref"
  }
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