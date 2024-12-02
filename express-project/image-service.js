const UUID = require('uuid')

class ImagesService {
  #images = {}

  constructor() {

  }

  async uploadImage(imageData) {
    let imgId = UUID.v7()
    this.#images[imgId] = Buffer.from(imageData, 'base64')
    return imgId
  }

  async findImage(imageId) {
    let data = this.#images[imageId]
    return data
  }
}

module.exports = ImagesService