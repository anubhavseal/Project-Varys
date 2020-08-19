'use strict';
const { Model } = require('sequelize');

const { Sequelize, DB } = require('../db/db-connector');
const { HttpBadRequestError } = require('../error');

class Token extends Model {
  static async logout(customerAuthToken) {
    const token = await Token.findOne({ where: { token: customerAuthToken } });
    if (!token) throw new HttpBadRequestError(400, 'Alliens are not allowed yet');
    token['deleted_at'] = new Date();
    token['destroyed_because'] = 'Logged Out';
    await token.save();
    return true;
  }
}

Token.init(
  {
    customer_id: {
      type: Sequelize.DataTypes.INTEGER,
      // references: {
      //   model: User,
      //   key: 'id',
      // },
    },
    token: Sequelize.DataTypes.STRING,
    expiry: Sequelize.DataTypes.DATE,
    medium: Sequelize.DataTypes.STRING,
    destroyed_because: Sequelize.DataTypes.STRING,
    deleted_at: Sequelize.DataTypes.DATE,
  },
  {
    sequelize: DB,
    modelName: 'Token',
    tableName: 'tokens',
  }
);

module.exports = Token;
// Token.belongsTo(User);
