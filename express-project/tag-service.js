export default class TagService {
  #tags = []

  constructor() {

  }

  async addTag(tag) {
    this.#tags.push(tag)
  }

  async validateTag(tag) {
    return this.#tags.includes(tag)
  }
}