const colors = require('colors');
const TronBoxError = require('./tronboxerror');
class DeployError extends TronBoxError {
  constructor(message) {
    message = 'Error deploying ' + contract_name + ':\n\n' + message + '\n\n' + colors.red('Deploy failed. See above.');
    super(message);
  }
}

module.exports = DeployError;
