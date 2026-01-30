const colors = require('colors');
const TronBoxError = require('./tronboxerror');

class BuildError extends TronBoxError {
  constructor(message) {
    message = 'Error building:\n\n' + message + '\n\n' + colors.red('Build failed. See above.');
    super(message);
  }
}

module.exports = BuildError;
