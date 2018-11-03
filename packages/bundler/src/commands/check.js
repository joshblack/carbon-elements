'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const babel = require('rollup-plugin-babel');
const cleanup = require('rollup-plugin-cleanup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const { rollup } = require('rollup');
const virtual = require('rollup-plugin-virtual');

const glob = require('../glob');
const { reporter } = require('../reporter');
const compile = require('../tools/compile');

async function check(pattern, { ignore, cwd } = {}) {
  reporter.info(`Running in: ${cwd}`);
  reporter.info(`Checking pattern: '${pattern}', ignoring: '${ignore}'`);

  // Assume globs are for checking scss files for now
  const files = await glob(pattern, {
    cwd,
    ignore,
  });

  if (files.length === 0) {
    reporter.error(`Unable to find any files for pattern: \`${pattern}\``);
    process.exit(1);
  }

  reporter.info(`Checking ${files.length} files...`);

  const results = await Promise.all(
    files.map(file => {
      const filepath = path.join(cwd, file);
      const extension = path.extname(filepath);
      if (checkers.has(extension)) {
        return checkers.get(extension)(filepath, {
          cwd,
        });
      }
      return {
        filepath,
        error: new Error(
          `Unable to check file with extension: ${extension}. Supported ` +
            `extensions include: [${[...checkers.keys()].join(', ')}]`
        ),
      };
    })
  );

  const errors = results.reduce((acc, result) => {
    if (result.error) {
      const error = result.error;
      error.filepath = result.filepath;
      return acc.concat(error);
    }
    return acc;
  }, []);

  if (errors.length > 0) {
    errors.forEach(error => {
      const { formatted, filepath } = error;
      reporter.error(`Error ${path.relative(cwd, filepath)}`);
      console.log(chalk.gray(formatted || error));
    });
    process.exit(1);
    return;
  }

  reporter.success(`Successfully checked ${files.length} files! 🎉`);
  process.exit(0);
}

const checkers = new Map([
  [
    '.scss',
    // Check that our scss files can compile successfully
    function check(filepath, options = {}) {
      return compile(filepath, {
        includePaths: ['node_modules', '../../node_modules'],
        ...options,
      });
    },
  ],
  [
    '.js',
    // Check that our JS bundle can be tree-shaken
    async function check(filepath) {
      process.env.BABEL_ENV = 'es';
      const packageDirectory = await findPackageDirectoryFor(filepath);
      const ownNodeModules = path.join(packageDirectory, 'node_modules');
      const packageJson = await fs.readJson(
        path.join(packageDirectory, 'package.json')
      );
      // TODO: add as dependency or peer dependency to project
      const external = ['prop-types'];
      if (packageJson.dependencies) {
        external.push(...Object.keys(packageJson.dependencies));
      }
      if (packageJson.peerDependencies) {
        external.push(...Object.keys(packageJson.peerDependencies));
      }

      const bundle = await rollup({
        input: '__treeshake__',
        external,
        plugins: [
          commonjs({
            include: ['node_modules/**', `${ownNodeModules}/**`],
          }),
          nodeResolve({
            module: true,
            jsnext: true,
            browser: true,
          }),
          babel({
            exclude: 'node_modules/**',
          }),
          virtual({
            __treeshake__: `import ${JSON.stringify(filepath)}`,
          }),
          terser({
            output: {
              beautify: true,
              comments: true,
            },
            mangle: false,
            // compress: false,
            module: true,
            toplevel: true,
          }),
        ],
        onwarn(warning, handle) {
          if (warning.code !== 'EMPTY_BUNDLE') {
            handle(warning);
          }
        },
      });
      const output = await bundle.generate({
        format: 'esm',
      });
      console.log(output.code.trim());
      // if (output.code.trim() === '') {
      return {
        filepath,
      };
      // }
      // return {
      // filepath,
      // error: new Error(`The file at: \`${filepath}\` is not tree-shakeable.`),
      // };
    },
  ],
]);

async function findPackageDirectoryFor(filepath) {
  let workingDirectory = path.dirname(filepath);
  while (workingDirectory !== path.dirname(workingDirectory)) {
    const files = await fs.readdir(workingDirectory);
    if (files.indexOf('package.json') !== -1) {
      return workingDirectory;
    }
    workingDirectory = path.dirname(workingDirectory);
  }
  throw new Error(
    `Unable to find a corresponding \`package.json\` for file: \`${filepath}\``
  );
}

module.exports = check;
