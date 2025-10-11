const version = require('../version');
const describe = 'Compile contract source files';

const command = {
  command: 'compile',
  describe,
  builder: yargs => {
    yargs
      .usage(
        `TronBox v${version.bundle}\n\n${describe}\n
Usage: $0 compile [--all] [--evm] [--quiet] `
      )
      .version(false)
      .options({
        all: {
          describe: 'Compile all contracts, not just changed ones',
          type: 'boolean'
        },
        evm: {
          describe: 'Use EVM configuration',
          type: 'boolean'
        },
        quiet: {
          describe: 'Suppress all output except errors',
          type: 'boolean'
        }
      })
      .example('$0 compile', 'Compile all contracts in the project')
      .example('$0 compile --all', 'Compile all contracts, even if not changed')
      .example('$0 compile --evm', 'Compile using EVM configuration')
      .group(['all', 'evm', 'quiet', 'help'], 'Options:');
  },
  run: function (options, done) {
    process.env.CURRENT = 'compile';
    const Config = require('../../components/Config');
    const Contracts = require('../../components/WorkflowCompile');

    if (options.quiet || options.silent) {
      options.logger = {
        log: function () {}
      };
    }

    const config = Config.detect(options);
    Contracts.compile(config, done);
  }
};

module.exports = command;
