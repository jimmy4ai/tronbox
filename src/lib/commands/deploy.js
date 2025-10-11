const migrate = require('./migrate');

const command = {
  command: 'deploy',
  description: '(alias for migrate)',
  builder: yargs => {
    migrate.builder(yargs, 'deploy');
  },
  run: migrate.run
};

module.exports = command;
