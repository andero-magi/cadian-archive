import ex from "express"
import ImagesService from "../image-service.js"

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
   * @param {ex.Request} req 
   * @param {ex.Response} res 
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