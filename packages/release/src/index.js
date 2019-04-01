/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const cli = require('./cli');

async function run({ argv, cwd }) {
  cli.parse(argv.slice(2)).argv;
}

module.exports = run;

// const chalk = require('chalk');

// const theme = chalk.constructor();

// theme.link = theme.hex('#0091ea').underline.italic;

// console.log(theme`hello {link this is a link}`);
