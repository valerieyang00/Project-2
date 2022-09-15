'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.feed.belongsTo(models.user)
      models.feed.belongsTo(models.activity)
      models.feed.hasMany(models.comment)
    }
  }
  feed.init({
    userId: DataTypes.INTEGER,
    activityId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'feed',
  });
  return feed;
};