/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const cli = require('yargs');
const packageJson = require('../package.json');
const build = require('./commands/build');
const optimize = require('./commands/optimize');

async function main({ argv, cwd }) {
  const workingDirectory = cwd();

  // prettier-ignore
  cli
    .scriptName(packageJson.name)
    .version(packageJson.version);

  cli.command({
    command: 'optimize <folder>',
    aliases: ['o'],
    description: 'optimize SVG assets in a folder',
    builder(yargs) {
      yargs.option('output-dir', {
        alias: 'd',
        description: 'specify a directory for the optimized files',
        type: 'string',
        demandOption: true,
        requiresArg: true,
      });
    },
    handler(argv) {
      argv.cwd = workingDirectory;
      return optimize(argv);
    },
  });

  cli.command({
    command: 'build <folder>',
    description:
      'optimize SVG assets and build in ES2015, CommonJS, and UMD module formats',
    builder(yargs) {
      yargs.option('output-dir', {
        alias: 'd',
        description: 'specify the root directory for the output module folders',
        type: 'string',
        demandOption: true,
        requiresArg: true,
      });
    },
    handler(argv) {
      argv.cwd = workingDirectory;
      return build(argv);
    },
  });

  cli
    .demandCommand()
    .recommendCommands()
    .strict()
    .parse(argv.slice(2)).argv;
}

module.exports = main;
