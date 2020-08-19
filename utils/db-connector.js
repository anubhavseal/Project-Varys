const Sequelize = require('sequelize');

class DBConnector {
  constructor() {
    this.config = this.getConfig();
  }

  getConfig() {
    return {
      username: 'furlenco',
      password: null,
      database: 'varys',
      host: '127.0.0.1',
      port: 5432,
      dialect: 'postgres',
      benchmark: true,
      logging: console.log,
      define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true,
      },
    };
  }

  connect() {
    if (this.config) {
      this.sequelize = new Sequelize(this.config.database, this.config.username, this.config.password, this.config);
    } else {
      this.sequelize = new Sequelize(process.env.DATABASE_URL, this.config);
    }
  }
}

const dbConnector = new DBConnector();
dbConnector.connect();

module.exports = {
  DB: dbConnector.sequelize,
  Sequelize,
};
