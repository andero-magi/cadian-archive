import { v7 } from 'uuid'

class ImagesService {
  #images = {}

  constructor() {

  }

  async uploadImage(imageData) {
    let imgId = v7()
    this.#images[imgId] = Buffer.from(imageData, 'base64')
    return imgId
  }

  async findImage(imageId) {
    let data = this.#images[imageId]
    return data
  }
}

export default ImagesService