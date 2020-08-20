const router = require('express').Router();

const { Guest } = require('../models');
const { v4: uuidv4 } = require('uuid');

router.post('/create', async (req, res) => {
  const token = uuidv4();
  const guest = await Guest.create({ token, medium: 'web' });
  res.setHeader('X-Guest-Token', guest.token);
  res.cookie('__wd_guest', guest.token);
  return res.status(201).send({
    status: true,
    data: {
      message: 'Guest user created',
      id: guest.id,
      is_guest: true,
    },
  });
});

module.exports = router;
