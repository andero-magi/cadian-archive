import Sequelize, { DataTypes, Model } from "@sequelize/core";

export class ImageModel extends Model {
  id
  image_type
  image_data
}

/**
 * 
 * @param {Sequelize} sequelize 
 */
export function initImageModel(sequelize) {
  ImageModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      image_type: {
        type: DataTypes.ENUM('jpeg', 'png')
      },
      image_data: {
        type: DataTypes.BLOB('long')
      }
    },
    {
      sequelize
    }
  )
}