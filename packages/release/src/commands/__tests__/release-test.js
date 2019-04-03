/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

'use strict';

const path = require('path');
const run = require('../');

describe('carbon-release', () => {
  it('should work', async () => {
    const packageFixture = path.resolve(__dirname, '../__fixtures__/package-a');
    const mockProcess = {
      cwd: () => packageFixture,
      argv: [null, null, 'publish', '--help'],
    };

    // run(mockProcess);
  });
});
