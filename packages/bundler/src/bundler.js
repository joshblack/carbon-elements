/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { reporter } = require('@carbon/cli-reporter');
const program = require('commander');
const path = require('path');
const cli = require('yargs');
const packageJson = require('../package.json');
const bundlers = require('./bundlers');
const bundle = require('./commands/bundle');
const check = require('./commands/check');
const measure = require('./commands/measure');

async function bundler({ argv, cwd: getWorkingDirectory }) {
  const cwd = getWorkingDirectory();

  // prettier-ignore
  cli
    .scriptName('bundler')
    .version(packageJson.version)
    .usage('bundler <command> [options]');

  // check package(s) to see if scss files compile
  cli.command(
    'check <glob>',
    'check that each file can be compiled',
    {
      ignore: {
        alias: 'i',
        describe: 'pass in a glob of files to ignore',
        array: true,
        default: [],
      },
      list: {
        alias: 'l',
        describe: 'list all the files that were compiled',
        default: false,
        type: 'boolean',
      },
    },
    async args => {
      const { glob, ignore, list } = args;
      await runCommand(() =>
        check(glob, {
          cwd,
          list,
          ignore,
        })
      );
    }
  );

  cli.command(
    'measure <glob>',
    'measure the compiled size of your package(s)',
    {
      ignore: {
        alias: 'i',
        describe: 'pass in a glob of files to ignore',
        array: true,
        default: [],
      },
      output: {
        alias: 'o',
        describe: 'specify the output path of your report',
        type: 'string',
      },
    },
    async args => {
      const { glob, ignore, output } = args;
      await runCommand(() =>
        measure(glob, {
          cwd,
          ignore,
          output,
        })
      );
    }
  );

  cli.command(
    'bundle <entrypoint>',
    'bundle the given .js entrypoint',
    {
      name: {
        alias: 'n',
        describe: 'name the module for the UMD build',
        demandOption: true,
        type: 'string',
      },
      globals: {
        alias: 'g',
        describe: 'global module names',
        array: true,
        default: [],
      },
    },
    async ({ entrypoint, ...args }) => {
      await runCommand(() =>
        bundle(entrypoint, args, {
          cwd,
        })
      );
    }
  );

  cli.command(
    'bundle:scss <entrypoint>',
    'bundle the given .scss entrypoint',
    {
      name: {
        alias: 'n',
        describe: 'the name of the output file',
        type: 'string',
      },
      output: {
        alias: 'a',
        describe: 'the name of the directory',
        type: 'string',
        default: 'css',
      },
    },
    async ({ entrypoint, ...args }) => {
      await runCommand(() => bundle(entrypoint, args, { cwd }));
    }
  );

  cli.command(
    'inline',
    'transform a scss directory to all inline exports',
    {},
    async args => {
      //
    }
  );

  cli
    .demandCommand()
    .recommendCommands()
    .strict()
    .parse(argv.slice(2)).argv;
}

async function runCommand(makePromise) {
  try {
    await makePromise();
    console.log('Done! ✨');
  } catch (error) {
    reporter.error('Yikes, looks like something really went wrong.');
    reporter.error('Please make an issue with the following info:');
    console.log(error);
  }
}

module.exports = bundler;
