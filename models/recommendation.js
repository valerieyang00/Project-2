'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recommendation.belongsTo(models.user)
      models.recommendation.belongsTo(models.activity)
    }
  }
  recommendation.init({
    userId: DataTypes.INTEGER,
    activityId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    resource: DataTypes.TEXT,
    content: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'recommendation',
  });
  return recommendation;
}