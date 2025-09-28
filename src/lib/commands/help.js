const yargs = require('yargs/yargs');
const version = require('../version');

const command = {
  command: 'help',
  describe: 'Show general help and list all available commands',
  builder: {},
  run: function (options, done) {
    const args = yargs().detectLocale(false).exitProcess(false).version(false).help(false);

    Object.keys(options.commands).forEach(function (command) {
      args.command(options.commands[command]);
    });

    args
      .usage(
        `TronBox v${version.bundle} - a development framework for Tron

Usage: tronbox <command> [options]`
      )
      .epilog('See more at https://tronbox.io/docs/')
      .showHelp();

    done();
  }
};

module.exports = command;
