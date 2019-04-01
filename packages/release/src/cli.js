/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const cli = require('yargs');
const packageJson = require('../package.json');

cli
  .scriptName(packageJson.name)
  .version(packageJson.version)
  .option('dry', {
    alias: 'd',
    describe:
      'view the result of running this command without changing any files',
    default: false,
  })
  .option('verbose', {
    default: false,
    describe: 'display the full output while running a command',
  });

cli
  .demandCommand()
  .recommendCommands()
  .strict();

module.exports = cli;
