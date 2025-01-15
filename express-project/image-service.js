import Sequelize from '@sequelize/core'
import { v7 } from 'uuid'
import { ImageModel } from './models/Image.model.js'

class ImagesService {
  #images = {}
  #db

  /**
   * 
   * @param {Sequelize} db 
   */
  constructor(db) {
    this.#db = db
  }

  async uploadImage(imageData, imageType) {
    let imgId = v7()
    let buf = Buffer.from(imageData, 'base64')

    let i = await ImageModel.create({
      id: imgId,
      image_data: buf,
      image_type: imageType
    })
    i.save()

    this.#images[imgId] = i

    return imgId
  }

  /**
   * @param {string} imageId 
   */
  async deleteImage(imageId) {
    let image = await this.findImage(imageId)
    delete this.#images[imageId]
    await image.destroy()
  }

  /**
   * @param {string} imageId 
   * @returns {Promise<ImageModel>}
   */
  async findImage(imageId) {
    let cached = this.#images[imageId]

    if (cached != null) {
      return cached
    }

    let result = await ImageModel.findOne({where: {id: imageId}})
    this.#images[result.id] = result

    return result
  }
}

export default ImagesService