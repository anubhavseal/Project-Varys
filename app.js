require('express-async-errors');

const chalk = require('chalk');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();
const { DB } = require('./db/db-connector');
const HttpError = require('./error');

const customers = require('./api/customers');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/customers', customers);

app.get('/', (req, res) => {
  console.log('hello there');
  res.status(200).send({ 1: 1 });
});

app.use(function (err, req, res, next) {
  if (HttpError.isOperationalError(err)) {
    const { status, message, ...rest } = err.handleError();
    res.status(status).send({
      status: false,
      message: message,
      data: rest,
    });
  } else {
    next(err);
  }
});

async function bootstrap() {
  try {
    await DB.authenticate();
    console.log(chalk.bold.greenBright('Postgress Connection has been established successfully.'));
    app.listen(3050, () => {
      console.log(chalk.bold.green('Server listening at 3000'));
    });
  } catch (error) {
    console.error(chalk.bold.redBright('Unable to connect to the database:', error));
  }
}

bootstrap();
