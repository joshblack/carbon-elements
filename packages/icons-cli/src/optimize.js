/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const { svgo } = require('./tools/svgo');
const { flatMapAsync } = require('./tools/flatMap');

async function optimize(files) {
  const optimized = await flatMapAsync(files, async file => {
    const { filepath, basename, size, prefix } = file;
    const source = await fs.readFile(filepath);
    const optimized = await svgo.optimize(source, {
      path: filepath,
    });

    return {
      ...file,
      source,
      optimized,
    };
  });

  return optimized;
}

module.exports = optimize;
