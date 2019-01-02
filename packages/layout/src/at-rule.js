/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

function createAtRule(name) {
  return (parts, ...substitutions) => {
    if (Array.isArray(parts)) {
      return (
        name +
        ' ' +
        parts.reduce((acc, part, index) => {
          return acc + substitutions[index - 1] + part;
        })
      );
    }
    return name + ' ' + parts;
  };
}

export const media = createAtRule('@media');
export const supports = createAtRule('@supports');
