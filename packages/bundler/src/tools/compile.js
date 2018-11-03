'use strict';

const path = require('path');
const sass = require('node-sass');

const compilers = new Map([
  [
    '.scss',
    function compile(filepath, options = {}) {
      const defaultOptions = {
        includePaths: ['node_modules', '../../node_modules'],
      };
      return new Promise((resolve, reject) => {
        sass.render(
          {
            file: filepath,
            ...defaultOptions,
            ...options,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );
      });
    },
  ],
]);

function compile(filepath, options) {
  const extension = path.extname(filepath);
  if (compilers.has(extension)) {
    return compilers.get(extension)(filepath, options);
  }
  return {
    filepath,
    error: new Error(
      `Unable to compile file with extension: ${extension}. Supported ` +
        `extensions include: [${[...checkers.keys()].join(', ')}]`
    ),
  };
}

module.exports = compile;
