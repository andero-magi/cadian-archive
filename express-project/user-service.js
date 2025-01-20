import * as UUID from "uuid"
import { User } from "./models/User.model.js";
import Sequelize, { col, fn } from "@sequelize/core";

export class UserService {
  #cache = {}

  constructor() {
  }

  
  generateUserId(){
    return UUID.v7();
  }

  /**
   * @param {string} id 
   * @returns {Promise<User>}
   */
  async getUserById(id) {
    let cached = this.#cache[id]
    if (cached) {
      return cached
    }

    let found = await User.findOne({where: {id: id}})
    if (found) {
      this.#cache[id] = found
    }

    return found
  }

  /**
   * @param {any} userdata 
   * @returns {User}
   */
  async createUser(userdata){
    let user = await User.create(userdata)
    this.#cache[user.id] = user
    return user
  }

  async modifyUser(id, username, password, email) {
    let p = await this.getUserById(id)
    if (!p) {
      return null
    }

    p.set({
      username: username,
      password: password,
      email: email
    })
    await p.save()

    return p
  }

  async deleteUser(id) {
    let found = await this.getUserById(id)
    if (!found) {
      return false
    }

    await found.destroy()
    return true
  }
  
  async getAllUsers() {
    return await User.findAll()
  }

  async getUsersByName(partialUsername){
    let found = User.findAll(
      {
        where: {
          username: where(fn('LOWER', col('username')), 'LIKE', `%${partialUsername.toLowerCase()}%`)
        }
      }
    )

    if (!found) {
      return null
    }

    this.#cache[found.id] = found
    return found
  }
  
}