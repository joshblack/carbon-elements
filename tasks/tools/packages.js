'use strict';

const fs = require('fs-extra');
const path = require('path');

const PACKAGES_DIR = path.resolve(__dirname, '../../packages');

async function getPackages() {
  const packageNames = (await fs.readdir(PACKAGES_DIR)).filter(name => {
    return name !== '.DS_Store';
  });
  const packages = await Promise.all(
    packageNames.map(async name => {
      // Verify that each file that we read from the packages directory is
      // actually a folder. Typically used to catch `.DS_store` files that
      // accidentally appear when opening with MacOS Finder
      const filepath = path.join(PACKAGES_DIR, name);
      const stat = await fs.lstat(filepath);
      if (!stat.isDirectory()) {
        throw new Error(`Unexpected file: ${name} at ${filepath}`);
      }

      const packageJsonPath = path.join(filepath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);

      const descriptor = {
        filepath,
        packageJson,
        examples: [],
      };

      const examplesDir = path.join(filepath, 'examples');
      if (!(await fs.pathExists(examplesDir))) {
        return descriptor;
      }

      const examples = (await fs.readdir(examplesDir)).filter(example => {
        return example !== '.yarnrc';
      });

      return {
        ...descriptor,
        examples: await Promise.all(
          examples.map(async name => ({
            filepath: path.join(examplesDir, name),
            name,
            packageJson: await fs.readJson(
              path.join(examplesDir, name, 'package.json')
            ),
          }))
        ),
      };
    })
  );
  return packages;
}

module.exports = {
  getPackages,
};
