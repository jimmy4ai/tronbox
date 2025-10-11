const TruffleError = require('@truffle/error');

// HACK: string comparison seems to be only way to identify being unable to
// connect to RPC node.
const NOT_CONNECTED_MESSAGE = 'Invalid JSON RPC response: ""';

class ProviderError extends TruffleError {
  constructor(message) {
    if (message === NOT_CONNECTED_MESSAGE) {
      message =
        'Could not connect to your node.\n' +
        'Please check that the node:\n' +
        '    - is running\n' +
        '    - is reachable over the network\n' +
        '    - is configured correctly in your project configuration.\n';
    }
    super(message);
    this.message = message;
  }
}

module.exports = ProviderError;
