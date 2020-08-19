const { HttpError } = require('../utils/error');

function errorResponder(err, req, res, next) {
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
}

module.exports = errorResponder;
