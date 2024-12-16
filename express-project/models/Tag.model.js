import Sequelize, { DataTypes, Deferrable, Model } from "@sequelize/core";

export class Tag extends Model {
  id
  parent_id
  is_alias
}

/**
 * 
 * @param {Sequelize} sequelize 
 */
export function initTagModel(sequelize) {
  Tag.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      parent_id: {
        type: DataTypes.STRING,
        references: {
          table: "Tags",
          key: 'id',
          deferrable: Deferrable.INITIALLY_DEFERRED
        }
      },
      is_alias: {
        type: DataTypes.BOOLEAN,
      }
    },
    {sequelize}
  )
}