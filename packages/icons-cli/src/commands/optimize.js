/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { reporter } = require('@carbon/cli-reporter');
const fs = require('fs-extra');
const path = require('path');
const { svgo } = require('../tools/svgo');
const { flatMapAsync } = require('../tools/flatMap');
const search = require('../search');
const optimize = require('../optimize');

async function command({ cwd, folder, outputDir }) {
  reporter.info(
    `Optimizing icons in the folder: \`${path.join(cwd, folder)}\``
  );
  const files = await search(folder);

  reporter.info(`Optimizing ${files.length} icons...`);
  const optimized = await optimize(files);

  reporter.success(`Successfully optimized ${optimized.length} icons 🎉`);

  reporter.info(`Writing files to: ${path.join(cwd, outputDir)}`);
  await Promise.all(
    optimized.map(async file => {
      const { filename, prefix, optimized, size, source } = file;
      const currentOutputDir = path.join(cwd, outputDir, ...prefix);
      const target = path.join(currentOutputDir, filename);

      await fs.ensureDir(currentOutputDir);
      await fs.writeFile(target, optimized.data);
    })
  );

  reporter.success(`Done ✨`);
}

module.exports = command;
