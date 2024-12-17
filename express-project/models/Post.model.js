import Sequelize, { DataTypes, Model } from '@sequelize/core';

export class Post extends Model {
  id
  upload_date
  modified_date
  author_id
  content
}

/**
 * 
 * @param {Sequelize} sequelize 
 */
export function initPostModel(sequelize) {
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      upload_date: {
        type: DataTypes.DATE
      },
      modified_date: {
        type: DataTypes.DATE
      },
      author_id: {
        type: DataTypes.UUID
      },
      content: {
        type: DataTypes.JSON
      }
    },
    {sequelize: sequelize}
  )

  console.log(Post === sequelize.models.Post)
}