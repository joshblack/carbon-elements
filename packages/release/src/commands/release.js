/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

async function release() {
  // Check current project has a package.json with a version
  // Check if GH_TOKEN is defined for GitHub Release
  // Check that local git status is clean
  // Confirm version change
  // Confirm privilege to release
  // Create git tag for version
  // Run `npm release` with given tag and dry settings
  // Push tags upstream
  // Changelogs?
  // Publish GitHub Release?
  console.log('releaseing');
}

// Dry run
// dist-tag
// git tag
// conventional changelog
module.exports = {
  command: release,
  apply(cli, context) {
    return cli.command(
      '$0 [major | minor | patch | premajor | preminor | prepatch | prerelease]',
      'trigger a release for your project',
      {
        'dry-run': {
          default: false,
        },
        tag: {},
      },
      async args => {
        await release();
      }
    );
  },
};
