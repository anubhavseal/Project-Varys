const Joi = require('joi');
const router = require('express').Router();

const { Customer, Token } = require('../../models');
const ApiError = require('../../error');

router.get('/validate_login_id', async (req, res) => {
  const { login_id } = req.query;
  const schema = { login_id: Joi.string().email().required() };

  const { error } = Joi.object(schema).validate(req.query);
  if (error) throw new ApiError(400, error.message, error.details[0]);

  const customer = await Customer.findOne({ where: { email_id: login_id } });
  if (!customer) throw new ApiError(400, 'Account is not registered with us');

  const response = { is_valid: true, has_password: customer.password ? true : false };
  res.status(200).send({ status: true, data: response });
});

router.get('/info', async (req, res) => {
  const customerAuthToken = req.cookies['__wd_dev_varys'];
  if (!customerAuthToken) throw new ApiError(400, 'Customer is not logged in');
  const token = await Token.findOne({ where: { token: customerAuthToken, deleted_at: null }, include: Customer });
  if (!token) throw new ApiError(400);
  const customer = await token.getCustomer({ attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
  return res.status(200).send({ status: true, data: customer });
});

router.put('/', async (req, res) => {
  const customerToken = req.cookies['__wd_dev_varys'];
  const token = await Token.findOne({ where: { token: customerToken }, include: Customer });
  const customer = await token.getUser();
  return res.status(200).send({ status: true, data: customer });
});

router.post('/register', async (req, res, next) => {
  const schema = {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    email_id: Joi.string().email().required(),
    contact_no: Joi.number().required(),
  };

  const { error } = Joi.object(schema).validate(req.body);
  if (error) throw new ApiError(400, error.message, error.details[0]);

  const { first_name, last_name, password, contact_no, email_id } = req.body;
  const customer = await Customer.register({ first_name, last_name, password, contact_no, email_id });
  res.status(201).send({
    status: true,
    data: customer,
  });
});

router.post('/login', async (req, res) => {
  const schema = {
    login_id: Joi.string().email().required(),
    password: Joi.string().alphanum().required(),
  };

  const { error } = Joi.object(schema).validate(req.body);
  if (error) throw new ApiError(400, error.message, error.details[0]);

  const { login_id, password } = req.body;
  const { expiry, token } = await Customer.login({ email: login_id, password });
  res.cookie('__wd_dev_varys', token, { expires: new Date(expiry) });
  res.status(200).send({ status: true });
});

router.put('/logout', async (req, res) => {
  const customerAuthToken = req.cookies['__wd_dev_varys'];
  if (!customerAuthToken) throw new ApiError(400, 'Customer is not logged in');
  const token = await Token.findOne({ where: { token: customerAuthToken } });
  if (!token) throw new ApiError(400, 'Alliens are not allowed yet');
  token['deleted_at'] = new Date();
  token['destroyed_because'] = 'Logged Out';
  await token.save();
  res.cookie('__wd_dev_varys', token, { expires: new Date() });
  res.status(200).send({ status: true });
});

router.get('/:customerId', async (req, res) => {
  const schema = { customerId: Joi.string().required() };

  const { error } = Joi.object(schema).validate(req.params);
  if (error) throw new ApiError(400, error.message, error.details[0]);

  const { customerId } = req.params;
  const customer = await Customer.findOne({
    where: { id: customerId },
    attributes: ['id', 'customer_identifier', 'first_name'],
  });
  return res.status(200).send({ status: true, data: customer });
});

module.exports = router;
