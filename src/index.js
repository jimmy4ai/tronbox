require('source-map-support/register');

const Command = require('./lib/command');
const downloader = require('./downloader');

const command = new Command(require('./lib/commands'));

const options = {
  logger: console
};

const commands = process.argv.slice(2);

if (commands[0] === '--download-compiler' && commands[1]) {
  downloader(commands[1], commands[2]);
} else {
  command.run(commands, options, function (err) {
    if (err) {
      if (typeof err === 'number') {
        // If a number is returned, exit with that number.
        process.exit(err);
      } else if (err instanceof Error) {
        console.error(err.stack || err.message);
      } else {
        // Handle other types (string, object, etc.)
        console.error(err.message || err.toString() || String(err));
      }
      process.exit(1);
    }

    // Don't exit if no error; if something is keeping the process open,
    // like `tronbox console`, then let it.

    // Clear any polling or open sockets - `provider-engine` in HDWallet
    // and `web3 1.0 confirmations` both leave interval timers etc wide open.
    const handles = process._getActiveHandles();
    handles.forEach(handle => {
      if (typeof handle.close === 'function') {
        handle.close();
      }
    });
  });
}
