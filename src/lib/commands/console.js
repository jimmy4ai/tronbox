const version = require('../version');
const describe = 'Run a console with contract abstractions and commands available';

const command = {
  command: 'console',
  describe,
  builder: yargs => {
    yargs
      .usage(
        `TronBox v${version.bundle}\n\n${describe}\n
Usage: $0 console [--network <network>] [--evm]`
      )
      .version(false)
      .options({
        network: {
          describe: 'Network name in configuration',
          type: 'string'
        },
        evm: {
          describe: 'Use EVM configuration',
          type: 'boolean'
        }
      })
      .example('$0 console', 'Start the console with the development network')
      .example('$0 console --network nile', 'Start the console with the nile network')
      .example('$0 console --evm', 'Start the console with EVM configuration')
      .group(['network', 'evm', 'help'], 'Options:');
  },
  run: function (options, done) {
    process.env.CURRENT = 'console';
    const Config = require('../../components/Config');
    const Console = require('../console');
    const Environment = require('../environment');

    const TronWrap = require('../../components/TronWrap');
    const logErrorAndExit = require('../../components/TronWrap').logErrorAndExit;

    const config = Config.detect(options);

    if (!config.network && config.networks.development) {
      config.network = 'development';
    }
    // init TronWeb
    try {
      TronWrap(config.networks[config.network], {
        evm: options.evm,
        verify: true,
        log: options.log
      });
    } catch (err) {
      logErrorAndExit(console, err.message);
    }

    // This require a smell?
    const commands = require('./index');
    const excluded = ['console', 'init', 'flatten', 'unbox'];

    const available_commands = Object.keys(commands).filter(function (name) {
      return excluded.indexOf(name) === -1;
    });

    const console_commands = {};
    available_commands.forEach(function (name) {
      console_commands[name] = commands[name];
    });

    Environment.detect(config, function (err) {
      if (err) return done(err);

      const c = new Console(
        console_commands,
        config.with({
          noAliases: true
        })
      );
      c.start(done);
    });
  }
};

module.exports = command;
