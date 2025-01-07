import Sequelize, { DataTypes, Model } from "@sequelize/core";

export class PostTag extends Model {
  id
  tag_id
  post_id
}

/**
 * 
 * @param {Sequelize} sequelize 
 */
export function initPostTagModel(sequelize) {
  PostTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
        autoIncrement: true
      },
      tag_id: {
        type: DataTypes.STRING,
        references: {
          table: "Tags",
          key: "id"
        }
      },
      post_id: {
        type: DataTypes.UUID,
        references: {
          table: "Posts",
          key: "id"
        }
      }
    },
    {sequelize}
  )
}