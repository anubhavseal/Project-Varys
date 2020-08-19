require('express-async-errors');

const chalk = require('chalk');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const { DB } = require('./utils/db-connector');
const { errorResponder } = require('./middlewares/error-responder');

const swaggerDocument = require('./swagger.json');
const customers = require('./api/customers');
const guests = require('./api/guests');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1/customers', customers);
app.use('/api/v1/guests', guests);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  console.log('hello there');
  res.status(200).send({ 1: 1 });
});

app.use(errorResponder);

async function bootstrap() {
  try {
    await DB.authenticate();
    console.log(chalk.bold.greenBright('Postgress Connection has been established successfully.'));
    app.listen(3050, () => {
      console.log(chalk.bold.green('Server listening at 3050'));
    });
  } catch (error) {
    console.error(chalk.bold.redBright('Unable to connect to the database:', error));
  }
}

bootstrap();
