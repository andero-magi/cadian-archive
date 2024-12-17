import Sequelize from "@sequelize/core";
import { initPostModel } from "./Post.model.js";
import { initImageModel } from "./Image.model.js";
import { initTagModel } from "./Tag.model.js";
import { initPostTagModel } from "./PostTag.model.js";

/**
 * Register models
 * @param {Sequelize} sequelize Sequelize instance
 */
export function registerModels(sequelize) {
  initPostModel(sequelize)
  initImageModel(sequelize)
  initTagModel(sequelize)
  initPostTagModel(sequelize)
}