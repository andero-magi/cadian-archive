import { Request, Response } from "express"
import ImagesService from "../image-service"

export class AssetsController {

  #service

  /**
   * Construct the service with the ImagesService
   * @param {ImagesService} service 
   */
  constructor(service) {
    this.#service = service
  }

  /**
   * Find an asset and return it
   * @param {Request} req 
   * @param {Response} res 
   */
  async findAsset(req, res) {
    let id = getIdParam(req, res)
    if (id == null) {
      return
    }
  
    let imgData = await this.#service.findImage(id)
    if (imgData == null) {
      res.status(404).send({error: `Image with ID ${id} not found`})
    }
  
    res.contentType = "image/jpeg"
    return res.status(200).send(imgData)
  }
}