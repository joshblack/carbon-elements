/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { reporter } = require('@carbon/cli-reporter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cssstats = require('cssstats');
const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const compile = require('../tools/compile');
const findPackageFolder = require('../tools/findPackageFolder');

const autoprefixerOptions = {
  browsers: ['last 1 version', 'ie >= 11', 'Firefox ESR'],
};

async function bundle(entrypoint, options, info) {
  reporter.info(`Bundling ${entrypoint}...`);

  const basename = options.name || path.basename(entrypoint, '.scss');
  const packageFolder = await findPackageFolder(entrypoint);
  const outputFolder = path.join(packageFolder, options.output);

  await fs.remove(outputFolder);
  await fs.ensureDir(outputFolder);

  const [uncompressed] = await Promise.all(compile([entrypoint]));
  const processedUncompressed = await postcss([
    autoprefixer(autoprefixerOptions),
    cssnano({
      preset: {
        plugins: [require('postcss-discard-comments')],
      },
    }),
  ]).process(uncompressed.result.css, {
    from: entrypoint,
    to: path.join(outputFolder, `${basename}.css`),
  });

  await fs.writeFile(
    path.join(outputFolder, `${basename}.css`),
    processedUncompressed.css
  );

  const [compressed] = await Promise.all(
    compile([entrypoint], {
      outputStyle: 'compressed',
    })
  );
  const processedCompressed = await postcss([
    autoprefixer(autoprefixerOptions),
    cssnano({
      preset: 'default',
    }),
    cssstats({
      safe: true,
      mediaQueries: true,
      importantDeclarations: true,
    }),
  ]).process(compressed.result.css, {
    from: entrypoint,
    to: path.join(outputFolder, `${basename}.min.css`),
  });

  await fs.writeFile(
    path.join(outputFolder, `${basename}.min.css`),
    processedCompressed.css
  );

  if (options.stats) {
    const [cssstatsResult] = processedCompressed.messages.filter(
      message => message.type === 'cssstats'
    );
    const { stats } = cssstatsResult;
    const statsJson = {
      size: stats.size,
      gzipSize: stats.gzipSize,
      rules: {
        total: stats.rules.total,
        size: {
          average: stats.rules.size.average,
          max: stats.rules.size.max,
        },
      },
      selectors: stats.selectors,
      declarations: {
        total: stats.declarations.total,
        unique: stats.declarations.unique,
        properties: Object.keys(stats.declarations.properties),
      },
      mediaQueries: {
        total: stats.mediaQueries.total,
        unique: stats.mediaQueries.unique,
        values: stats.mediaQueries.values,
      },
    };

    await fs.writeJson(path.join(packageFolder, 'stats.json'), statsJson, {
      spaces: 2,
    });
  }
}

module.exports = bundle;
