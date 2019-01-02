/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { breakpoints } from '../breakpoints';

function print(o) {
  return Object.keys(o).reduce((acc, key) => {
    console.log(o[key].toString);
    return {
      ...acc,
      [key]: typeof o[key] === 'object' ? print(o[key]) : o[key].toString(),
    };
  }, {});
}

describe('breakpoints', () => {
  test('h', () => {
    console.log(breakpoints.sm.width + '');
    //
  });
});
