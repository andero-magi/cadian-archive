const ss = require("sequelize")

module.exports = (ss) => {
  return ss.define(
    "Post",
    {
      id: {
        type: ss.DataTypes.UUID,
        primaryKey: true
      },
      upload_date: {
        type: ss.DataTypes.DATETIME
      },
      modified_date: {
        type: ss.DataTypes.DATETIME
      },
      author_id: {
        type: ss.DataTypes.UUID
      },
      content: {
        type: ss.DataTypes.JSON
      }
    }
  )
}