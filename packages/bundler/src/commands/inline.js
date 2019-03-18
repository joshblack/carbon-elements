/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs-extra');
const klaw = require('klaw-sync');
const os = require('os');
const path = require('path');
const replace = require('replace-in-file');

// Find node_modules folder
// Get dependencies from package.json
// Check if dependencies have `scss` folder, filter by these
// Add `vendor` folder
// Collapse scss folders
async function inline(entrypoint, options, info) {
  const { cwd } = info;
  const packageJsonPath = path.join(info.cwd, 'package.json');
  const entrypointPath = path.join(cwd, entrypoint);

  // console.log(JSON.stringify(result, null, 2));

  // return;

  // if (!(await fs.pathExists(packageJsonPath))) {
  // throw new Error(`Unable to find package.json at ${packageJsonPath}`);
  // }

  // const packageJson = await fs.readJson(packageJsonPath);
  // const { dependencies } = packageJson;

  // if (!dependencies || Object.keys(dependencies).length === 0) {
  // return;
  // }

  // const allDependencyFolders = await findNodeModulesFor(
  // Object.keys(dependencies),
  // cwd
  // );
  // const scssDependencies = await filter(allDependencyFolders, ([_, folder]) => {
  // return fs.pathExists(path.join(folder, 'scss'));
  // });

  const scssDependencies = await getSassDependenciesFor(info.cwd);

  async function copyDependencyToBundle(
    [dependency, scssFolderPath, childDependencies],
    copyTargetPath
  ) {
    const inlineFolderPath = path.join(copyTargetPath, 'bundled');
    const vendorFolderPath = path.join(inlineFolderPath, 'vendor');

    console.log(inlineFolderPath);
    // console.log(scssFolderPath, copyTargetPath);
    // console.log(dependency);
    // console.log(scssFolderPath);
    // console.log(childDependencies);
  }

  const scssFolderPath = path.join(info.cwd, options.output);

  await Promise.all(
    scssDependencies.map(dependency =>
      copyDependencyToBundle(dependency, scssFolderPath)
    )
  );
  return;

  // Make vendor folder
  // const scssFolderPath = path.join(info.cwd, options.output);
  const inlineFolderPath = path.join(info.cwd, options.output, 'bundled');
  const vendorFolderPath = path.join(inlineFolderPath, 'vendor');

  await fs.remove(inlineFolderPath);

  const tmpFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'carbon-bundler-'));

  // Copy to tmp folder before moving over
  await fs.copy(scssFolderPath, tmpFolder, {
    filter(filepath) {
      return filepath !== entrypointPath;
    },
  });
  await fs.ensureDir(inlineFolderPath);
  await fs.copy(tmpFolder, inlineFolderPath);

  // Clean-up tmp folder
  await fs.remove(tmpFolder);

  // Verify vendor folder exists before copying over scss folders from
  // dependencies
  await fs.ensureDir(vendorFolderPath);

  await Promise.all(
    scssDependencies.map(([dependency, folder]) => {
      const scssFolder = path.join(folder, 'scss');
      return fs.copy(scssFolder, path.join(vendorFolderPath, dependency));
    })
  );

  // Replace imports with inlined variants
  const files = klaw(inlineFolderPath, {
    nodir: true,
  }).filter(file => path.basename(file.path) === '_mixins.scss');
  const fromRegex = new RegExp(
    scssDependencies.reduce((acc, [dependency]) => {
      if (acc === '') {
        return dependency;
      }
      return acc + '|' + dependency;
    }, ''),
    'g'
  );

  await Promise.all(
    files.map(file => {
      const relativeImportPath = path.relative(
        path.dirname(file.path),
        inlineFolderPath
      );

      return replace({
        // dry: true,
        files: file.path,
        from: fromRegex,
        to(match) {
          if (relativeImportPath === '') {
            return `./${path.join('vendor', match)}`;
          }
          console.log(match);
          console.log(path.join(relativeImportPath, match));
          return '';
        },
      });
    })
  );
}

async function getSassDependenciesFor(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    throw new Error(
      `Unable to find package.json for package: ${packagePath} at ${packageJsonPath}`
    );
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const { dependencies } = packageJson;

  if (!dependencies || Object.keys(dependencies).length === 0) {
    return [];
  }

  return Promise.all(
    Object.keys(dependencies).map(async dependency => {
      let currentDirectory = packagePath;

      while (currentDirectory !== '/') {
        const nodeModulesFolder = path.join(currentDirectory, 'node_modules');

        if (await fs.pathExists(nodeModulesFolder)) {
          const dependencyPath = path.join(nodeModulesFolder, dependency);

          if (await fs.pathExists(dependencyPath)) {
            const scssFolderPath = path.join(dependencyPath, 'scss');
            if (await fs.pathExists(scssFolderPath)) {
              return [
                dependency,
                scssFolderPath,
                await getSassDependenciesFor(dependencyPath),
              ];
            }
            return [];
          }
        }

        currentDirectory = path.dirname(currentDirectory);
      }

      throw new Error(`Unable to find node_modules folder for ${dependency}`);
    })
  );
}

function findNodeModulesFor(dependencies, cwd, foundNodeModules = new Set()) {
  return Promise.all(
    dependencies.map(async dependency => {
      for (const nodeModuleFolder of foundNodeModules) {
        const packagePath = path.join(nodeModulesFolder, dependency);

        if (await fs.pathExists(packagePath)) {
          return [dependency, packagePath];
        }
      }

      let currentDirectory = cwd;

      while (currentDirectory !== '/') {
        const nodeModulesFolder = path.join(currentDirectory, 'node_modules');
        if (await fs.pathExists(nodeModulesFolder)) {
          foundNodeModules.add(nodeModulesFolder);

          const packagePath = path.join(nodeModulesFolder, dependency);

          if (await fs.pathExists(packagePath)) {
            return [dependency, packagePath];
          }
        }
        currentDirectory = path.dirname(currentDirectory);
      }

      throw new Error(`Unable to find node_modules folder for ${dependency}`);
    })
  );
}

async function filter(collection, callback) {
  const result = [];
  await Promise.all(
    collection.map(async (...args) => {
      if (await callback(...args)) {
        result.push(args[0]);
      }
    })
  );
  return result;
}

module.exports = inline;
