'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.activity.belongsTo(models.user)
      models.activity.hasMany(models.log)
      models.activity.hasMany(models.recommendation)
      models.activity.hasMany(models.feed)
    }
  }
  activity.init({
    activity: DataTypes.TEXT,
    type: DataTypes.STRING,
    accessibility: DataTypes.DECIMAL,
    participants: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    in_progress: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'activity',
  });
  return activity;
};