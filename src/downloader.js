const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const homedir = require('homedir');
const req = require('axios');

async function downloader(compilerVersion, evm) {
  const dir = path.join(homedir(), '.tronbox', evm ? 'evm-solc' : 'solc');
  const soljsonPath = path.join(dir, `soljson_v${compilerVersion}.js`);

  await fs.ensureDir(path.join(dir));

  let soljsonUrl = '';
  if (evm) {
    try {
      const solidityUrl = 'https://binaries.soliditylang.org/bin';
      const list = await req.get(`${solidityUrl}/list.json`);
      if (list && list.data) {
        if (list.data.releases && list.data.releases[compilerVersion]) {
          soljsonUrl = `${solidityUrl}/${list.data.releases[compilerVersion]}`;
        } else {
          console.info(
            chalk.red(
              chalk.bold('Error:'),
              `Unable to locate Solidity compiler version ${chalk.yellow(compilerVersion)}.`
            )
          );

          process.exit();
        }
      }
    } catch (error) {
      console.info(chalk.red(chalk.bold('Error:'), 'Failed to fetch Solidity compiler list.'));
      process.exit();
    }
  } else {
    try {
      const solidityUrl = 'https://tronprotocol.github.io/solc-bin/wasm';
      const list = await req.get(`${solidityUrl}/list.json`);
      if (list && list.data && list.data.builds) {
        list.data.builds.forEach(_ => {
          const { version, path } = _;
          if (version === compilerVersion) {
            soljsonUrl = `${solidityUrl}/${path}`;
          }
        });
        if (!soljsonUrl) {
          console.info(
            chalk.red(
              chalk.bold('Error:'),
              `Unable to locate Solidity compiler version ${chalk.yellow(compilerVersion)}.`
            )
          );
          process.exit();
        }
      }
    } catch (error) {
      console.info(chalk.red(chalk.bold('Error:'), 'Failed to fetch Solidity compiler list.'));
      process.exit();
    }
  }

  try {
    const res = await req.get(soljsonUrl, {
      responseType: 'arraybuffer'
    });

    if (res && res.data) {
      await fs.writeFile(soljsonPath, res.data);
      // double check
      if (!fs.existsSync(soljsonPath)) {
        console.info(chalk.red(chalk.bold('Error:'), 'Permission required.'));
        console.info(`
Most likely, you installed Node.js as root.
Please, download the compiler manually, running:

tronbox --download-compiler ${compilerVersion} ${evm ? '--evm' : ''}
`);
      } else {
        console.info('Compiler downloaded.');
      }
    }
  } catch (error) {
    console.info(chalk.red(chalk.bold('Error:'), 'Wrong Solidity compiler version.'));
    process.exit();
  }
}

module.exports = downloader;
