const TronBoxError = require('./tronboxerror');

class ConfigurationError extends TronBoxError {
  constructor(message) {
    super(message);
  }
}

module.exports = ConfigurationError;
