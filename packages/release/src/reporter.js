/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');

// Fix bold on Windows
// Reference: https://github.com/yarnpkg/yarn/blob/ed2c8a50c02505bdd6bd67d5e8c4461abc2b8dae/src/reporters/console/console-reporter.js#L32-L35
if (
  process.platform === 'win32' &&
  !(process.env.TERM && /^xterm/i.test(process.env.TERM))
) {
  chalk.bold._styles[0].close += '\u001b[m';
}

const theme = chalk.constructor();

const levels = ['error', 'warn', 'info', 'verbose', 'debug'];

class Reporter {
  constructor({ logLevel = 'info' } = {}) {
    this.format = theme;
    this._logLevel = logLevel;
  }

  log(message, level) {}

  setLogLevel(level) {
    this._logLevel = level;
  }
}

module.exports = {
  Reporter,
  reporter: new Reporter(),
};
