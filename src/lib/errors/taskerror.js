const TronBoxError = require('./tronboxerror');
class TaskError extends TronBoxError {
  constructor(message) {
    super(message);
  }
}

module.exports = TaskError;
