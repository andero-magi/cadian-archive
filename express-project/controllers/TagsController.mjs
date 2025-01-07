import TagService from "../tag-service.js"
import e from "express"
import { TagSearch } from "../tags-parser.js"
import { PostTag } from "../models/PostTag.model.js"

export class TagsController {
  #tagService

  /**
   * 
   * @param {TagService} service 
   */
  constructor(service) {
    this.#tagService = service
  }

  /**
   * 
   * @param {e.Request} req 
   * @param {e.Response} res 
   */
  async createNewTag(req, res) {
    let name = getNameParam(req, res)
    if (!name) {
      return
    }

    let existing = await this.#tagService.getTagData(name)
    if (existing) {
      res.status(400).send({error: `Tag with name ${name} already exists`})
      return
    }

    let result = await this.#tagService.createNewTag(name)
    res.status(201).send(result)
  }

  /**
   * 
   * @param {e.Request} req 
   * @param {e.Response} res 
   */
  async getTagData(req, res) {
    let name = getNameParam(req, res)
    if (!name) {
      return
    }

    let tagData = await this.#tagService.getTagData(name)
    res.status(200).send(tagData)
  }

  async listAllTags(req, res) {
    let allTags = await this.#tagService.getAllTags()
    res.status(200).send(allTags)
  }
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
function getNameParam(req, res) {
  let p = req.params.name ?? ""

  if (p == "") {
    res.status(400).send({error: "Missing tag name"})
    return null
  }

  return p
}