'use strict';
const { Model } = require('sequelize');
const { Sequelize, DB } = require('../db/db-connector');

class Guest extends Model {}
Guest.init(
  {
    customer_id: Sequelize.DataTypes.INTEGER,
    token: Sequelize.DataTypes.STRING,
    medium: Sequelize.DataTypes.STRING,
  },
  {
    sequelize: DB,
    modelName: 'Guest',
    tableName: 'guests',
  }
);

module.exports = Guest;
