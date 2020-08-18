const Customer = require('./customer');
const Token = require('./token');

// User.hasMany(Token);

Token.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = {};
