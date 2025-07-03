const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const homedir = require('homedir');
const req = require('superagent');

async function downloader(compilerVersion, evm) {
  const dir = path.join(homedir(), '.tronbox', evm ? 'evm-solc' : 'solc');
  const soljsonPath = path.join(dir, `soljson_v${compilerVersion}.js`);

  await fs.ensureDir(path.join(dir));

  let soljsonUrl = '';
  if (evm) {
    try {
      const solidityUrl = 'https://binaries.soliditylang.org/bin';
      const list = await req.get(`${solidityUrl}/list.json`);
      if (list && list.body) {
        if (list.body.releases && list.body.releases[compilerVersion]) {
          soljsonUrl = `${solidityUrl}/${list.body.releases[compilerVersion]}`;
        } else {
          process.stderr.write(
            chalk.red(
              chalk.bold('Error:'),
              `Unable to locate Solidity compiler version ${chalk.yellow(compilerVersion)}.`
            ) + '\n'
          );

          process.exit(1);
        }
      }
    } catch (error) {
      process.stderr.write(chalk.red(chalk.bold('Error:'), 'Failed to fetch Solidity compiler list.') + '\n');
      process.exit(1);
    }
  } else {
    try {
      const solidityUrl = 'https://tronprotocol.github.io/solc-bin/wasm';
      const list = await req.get(`${solidityUrl}/list.json`);
      if (list && list.body && list.body.builds) {
        list.body.builds.forEach(_ => {
          const { version, path } = _;
          if (version === compilerVersion) {
            soljsonUrl = `${solidityUrl}/${path}`;
          }
        });
        if (!soljsonUrl) {
          process.stderr.write(
            chalk.red(
              chalk.bold('Error:'),
              `Unable to locate Solidity compiler version ${chalk.yellow(compilerVersion)}.`
            ) + '\n'
          );
          process.exit(1);
        }
      }
    } catch (error) {
      process.stderr.write(chalk.red(chalk.bold('Error:'), 'Failed to fetch Solidity compiler list.') + '\n');
      process.exit(1);
    }
  }

  try {
    const res = await req.get(soljsonUrl).responseType('blob');

    if (res && res.body) {
      await fs.writeFile(soljsonPath, res.body);
      // double check
      if (!fs.existsSync(soljsonPath)) {
        process.stderr.write(chalk.red(chalk.bold('Error:'), 'Permission required.') + '\n');
        process.stderr.write(`
Most likely, you installed Node.js as root.
Please, download the compiler manually, running:

tronbox --download-compiler ${compilerVersion} ${evm ? '--evm' : ''}
`);
      } else {
        process.stdout.write('Compiler downloaded.\n');
      }
    }
  } catch (error) {
    process.stderr.write(chalk.red(chalk.bold('Error:'), 'Wrong Solidity compiler version.') + '\n');
    process.exit(1);
  }
}

module.exports = downloader;
