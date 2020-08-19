const chalk = require('chalk');

let decorators = {
  '500': (err) => {
    console.error(err);
    return err;
  },
  '400': {
    status: 400,
    message: 'Bad Request',
    translation: 'Your Destination is defined by what you give in',
    solution: 'Send a valid input',
  },
  '401': {
    status: 401,
    message: 'Unauthorized',
    translation: 'Great power comes with great beard. Grow some',
    solution: 'Obtain an Auth Token with required privileges from the admin/maintainer of this service',
  },

  '403': {
    status: 403,
    message: 'Forbidden',
    translation: 'Great power comes with great beard. Grow some',
    solution: 'Obtain an Auth Token with required privileges from the admin/maintainer of this service',
  },

  '404': {
    status: 404,
    message: 'Not Found',
    translation: "You've got the wrong address",
    solution: 'Find a correct address',
  },
};

function HttpError(httpCode = 500, message, payload) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.message = message;
  this.httpCode = httpCode;
  this.payload = payload;
  this.meta = { ...decorators[httpCode.toString()], message: this.message, ...this.payload };
}

HttpError.isOperationalError = function (err) {
  return err instanceof HttpError;
};

HttpError.prototype.handleError = function () {
  console.log(chalk.magentaBright(this));
  return this.meta;
};

HttpError.prototype.__proto__ = Error.prototype;

function HttpBadRequestError(message = 'Invalid Input') {
  HttpError.call(this, 400, message);
}

HttpBadRequestError.prototype.__proto__ = HttpError.prototype;

module.exports = {
  HttpError,
  HttpBadRequestError,
};
