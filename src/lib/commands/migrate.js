const version = require('../version');
const describe = 'Run migrations to deploy contracts';

const command = {
  command: 'migrate',
  describe,
  builder: (yargs, cmd = 'migrate') => {
    yargs
      .usage(
        `TronBox v${version.bundle}\n\n${describe}\n
Usage: $0 ${cmd} [--network <network>]
               ${' '.repeat(cmd.length)} [--reset] [--from <number>] [--to <number>]
               ${' '.repeat(cmd.length)} [--compile-all] [--evm] [--quiet]`
      )
      .version(false)
      .options({
        network: {
          describe: 'Network name in configuration',
          type: 'string'
        },
        reset: {
          describe: 'Re-run all migrations',
          type: 'boolean'
        },
        from: {
          alias: 'f',
          describe: 'Specify a migration number to run from',
          type: 'number'
        },
        to: {
          describe: 'Specify a migration number to run to',
          type: 'number'
        },
        'compile-all': {
          describe: 'Recompile all contracts',
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
      .example(`$0 ${cmd}`, 'Run all migrations on the development network')
      .example(`$0 ${cmd} --network nile`, 'Run migrations on the nile network')
      .example(`$0 ${cmd} --reset`, 'Re-run all migrations')
      .group(['network', 'reset', 'from', 'to', 'compile-all', 'evm', 'quiet', 'help'], 'Options:');
  },
  run: function (options, done) {
    process.env.CURRENT = 'migrate';
    const OS = require('os');
    const Config = require('../../components/Config');
    const Contracts = require('../../components/WorkflowCompile');
    const Migrate = require('../../components/Migrate');
    const Environment = require('../environment');
    const TronWrap = require('../../components/TronWrap');
    const { dlog } = require('../../components/TronWrap');
    const logErrorAndExit = require('../../components/TronWrap').logErrorAndExit;

    const config = Config.detect(options);

    // if "development" exists, default to using that
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

    function runMigrations(callback) {
      if (options.f) {
        Migrate.runFrom(options.f, config, done);
      } else {
        Migrate.needsMigrating(config, function (err, needsMigrating) {
          if (err) return callback(err);

          if (needsMigrating) {
            dlog('Starting migration');
            Migrate.run(config, done);
          } else {
            config.logger.log('Network up to date.');
            callback();
          }
        });
      }
    }

    Contracts.compile(config, function (err) {
      if (err) return done(err);
      Environment.detect(config, function (err) {
        if (err) return done(err);
        const dryRun = options.dryRun === true;

        let networkMessage = "Using network '" + config.network + "'";

        if (dryRun) {
          networkMessage += ' (dry run)';
        }

        config.logger.log(networkMessage + '.' + OS.EOL);
        runMigrations(done);
      });
    });
  }
};

module.exports = command;
