module.exports = {
  development: {
    "username": "furlenco",
    "password": null,
    "database": "varys",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres",
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  }, 
}