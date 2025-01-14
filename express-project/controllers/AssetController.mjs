import ex from "express"
import ImagesService from "../image-service.js"
import { getIdParam } from "../utils.mjs"

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

    let mimeType
  
    if (imgData.image_type == "png") {
      mimeType = "image/png"
    } else if (imgData.image_type == "jpeg") {
      mimeType = "image/jpeg"
    } else {
      mimeType = imgData.image_type
    }

    res.writeHead(200, null, {
      'content-type': mimeType,
      'content-length': imgData.image_data.length
    });
    res.end(imgData.image_data)
  }
}