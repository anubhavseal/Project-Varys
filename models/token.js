'use strict';
const { Model } = require('sequelize');
const { Sequelize, DB } = require('../db/db-connector');
const Customer = require('./customer');
// const { User } = require('./customer');
// module.exports = (sequelize, Sequelize.DataTypes) => {
//   return Token;
// };

class Token extends Model {
  static associate(models) {
    // define association here
    // Token.belongsTo(User);
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
