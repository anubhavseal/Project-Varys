const router = require('express').Router();
const CustomerController = require('../controllers/customers');

const customerController = new CustomerController();

router.post('/register', customerController.create.bind(this));
router.get('/validate_login_id', customerController.validateLoginId.bind(this));
router.post('/login', customerController.login.bind(this));
router.put('/logout', customerController.logout.bind(this));
router.get('/details', customerController.details.bind(this));
router.get('/:customerId', customerController.show.bind(this));

// router.put('/', async (req, res) => {
//   const customerToken = req.cookies['__wd_dev_varys'];
//   const token = await Token.findOne({ where: { token: customerToken }, include: Customer });
//   const customer = await token.getUser();
//   return res.status(200).send({ status: true, data: customer });
// });

module.exports = router;
