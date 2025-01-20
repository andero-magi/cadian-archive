import Sequelize, { DataTypes, Model } from "@sequelize/core";

export class User extends Model {
  id
  username
  email
  password
}

/**
 * @param {Sequelize} sequelize 
 */
export function initUserModel(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      }
    },
    {sequelize}
  )
}