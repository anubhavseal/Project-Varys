const Customer = require('./customer');
const Token = require('./token');
const Guest = require('./guest');

//Customer.hasMany(Token);
Customer.hasOne(Guest, { foreignKey: 'customer_id' });

Token.belongsTo(Customer, { foreignKey: 'customer_id' });

Guest.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = {};
