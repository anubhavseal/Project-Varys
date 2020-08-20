const Joi = require('joi');

const { Customer, Token } = require('../models');
const { HttpBadRequestError } = require('../utils/error');

class CustomerController {
  static setAuthToken(res, token, expiry) {
    res.setHeader('X-Auth-Token', token);
    res.cookie('__wd_dev_varys', token, { expires: new Date(expiry) });
  }

  static removeAuthToken(res) {
    res.clearCookie('__wd_dev_varys');
  }

  static removeGuestAuthToken(res) {
    res.removeHeader('X-Guest-Token');
    res.clearCookie('__wd_guest');
  }

  async create(req, res, next) {
    const schema = {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      password: Joi.string().alphanum().required(),
      email_id: Joi.string().email().required(),
      contact_no: Joi.number().required(),
    };

    const { error } = Joi.object(schema).validate(req.body);
    if (error) throw new HttpBadRequestError(error.message, error.details[0]);

    const { first_name, last_name, password, contact_no, email_id } = req.body;
    const { customer, token, expiry } = await Customer.register({
      first_name,
      last_name,
      password,
      contact_no,
      email_id,
    });

    CustomerController.setAuthToken(res, token, expiry);
    CustomerController.removeGuestAuthToken(res);

    res.status(201).send({
      status: true,
      data: customer,
    });
  }

  async validateLoginId(req, res, next) {
    const { login_id } = req.query;
    const schema = { login_id: Joi.string().email().required() };

    const { error } = Joi.object(schema).validate(req.query);
    if (error) throw new HttpBadRequestError(error.message, error.details[0]);

    const customer = await Customer.findOne({ where: { email_id: login_id } });
    if (!customer) throw new HttpBadRequestError('Account is not registered with us');

    const response = { is_valid: true, has_password: customer.password ? true : false };
    res.status(200).send({ status: true, data: response });
  }

  async login(req, res) {
    const schema = {
      username: Joi.string().email().required(),
      password: Joi.string().alphanum().required(),
    };

    const { error } = Joi.object(schema).validate(req.body);
    if (error) throw new HttpBadRequestError(error.message, error.details[0]);

    const { username, password } = req.body;
    const { expiry, token } = await Customer.login({ email: username, password });

    CustomerController.setAuthToken(res, token, expiry);
    CustomerController.removeGuestAuthToken(res);

    res.status(201).send({ status: true, data: { message: 'Login success' } });
  }

  async logout(req, res) {
    const customerAuthToken = req.cookies['__wd_dev_varys'];
    if (!customerAuthToken) throw new HttpBadRequestError('Customer is not logged in');
    const isLoggedOut = await Token.logout(customerAuthToken);
    isLoggedOut && CustomerController.removeAuthToken(res);
    res.status(200).send({ status: true });
  }

  async details(req, res) {
    const customerAuthToken = req.cookies['__wd_dev_varys'] || req.headers['X-Auth-Token'];
    if (!customerAuthToken) throw new HttpBadRequestError('Customer is not logged in');
    const token = await Token.findOne({ where: { token: customerAuthToken, deleted_at: null }, include: Customer });
    if (!token) throw new HttpBadRequestError(400);
    const customer = await token.getCustomer({ attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
    return res.status(200).send({ status: true, data: customer });
  }

  async show(req, res) {
    const schema = { customerId: Joi.string().required() };

    const { error } = Joi.object(schema).validate(req.params);
    if (error) throw new HttpBadRequestError(error.message, error.details[0]);

    const { customerId } = req.params;
    const customer = await Customer.findOne({
      where: { id: customerId },
      attributes: ['id', 'customer_identifier', 'first_name'],
    });
    return res.status(200).send({ status: true, data: customer });
  }
}

module.exports = CustomerController;
