const debug = require('debug')('contract-sources');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');

const DEFAULT_PATTERN = '**/*.{sol,vy,v.py,vyper.py,json,yul}';

module.exports = function findContractSources(pattern, callback) {
  const callbackPassed = typeof callback === 'function';

  if (!glob.hasMagic(pattern)) {
    pattern = path.join(pattern, DEFAULT_PATTERN);
    debug('Using default pattern, resolved to %s', pattern);
  }

  const globOptions = {
    follow: true,
    dot: true
  };

  return promisify(glob)(pattern, globOptions)
    .then(files => {
      debug('Found %d contract sources', files.length);
      if (callbackPassed) {
        callback(null, files);
        return undefined;
      }
      return files;
    })
    .catch(error => {
      debug('Error while searching for contract sources: %o', error);
      if (callbackPassed) {
        callback(error);
        return undefined;
      }
      throw error;
    });
};
