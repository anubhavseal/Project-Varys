'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const { Sequelize, DB } = require('../utils/db-connector');
const Token = require('./token');
const { HttpBadRequestError } = require('../utils/error');

class Customer extends Model {
  static async register(userInfo) {
    const existingCustomer = await Customer.findOne({ where: { contact_no: userInfo.contact_no } });
    if (existingCustomer) throw new HttpBadRequestError('Account is already registered with us');
    const { password } = userInfo;
    const salt = await bcrypt.genSalt(10);
    const hPassword = await bcrypt.hash(password, salt);
    const customer = await Customer.create({ ...userInfo, customer_identifier: 'WD12345', password: hPassword });
    const { expiry, token } = await Customer.login({ email: customer.email_id, password });
    return { customer, token, expiry };
  }

  /**
   *
   * @param {{email: string, password: string}} credentials
   * @description creates a auth token with an expiry of one year if credentials are valid
   * @throws HttpBadRequestError Exception
   */
  static async login(credentials) {
    const customer = await Customer.findOne({ where: { email_id: credentials.email } });
    if (!customer) throw new HttpBadRequestError('Account is not registered with us');
    const isPasswordValid = await bcrypt.compare(credentials.password, customer.password);
    if (!isPasswordValid) throw new HttpBadRequestError('Invalid Password');
    else {
      const token = uuidv4();
      const tokenExpiry = moment().add(1, 'years').toString();
      const authToken = await Token.create({ token, customer_id: customer.id, expiry: tokenExpiry });
      return { token: authToken.token, expiry: authToken.expiry };
    }
  }
}

Customer.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  delete values.password;
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

Customer.init(
  {
    customer_identifier: Sequelize.DataTypes.STRING,
    first_name: Sequelize.DataTypes.STRING,
    last_name: Sequelize.DataTypes.STRING,
    email_id: Sequelize.DataTypes.STRING,
    contact_no: Sequelize.DataTypes.BIGINT,
    password: Sequelize.DataTypes.STRING,
    user_type: Sequelize.DataTypes.STRING,
  },
  {
    sequelize: DB,
    modelName: 'Customer',
    tableName: 'customers',
  }
);

module.exports = Customer;
