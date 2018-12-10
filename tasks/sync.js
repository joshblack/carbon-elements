'use strict';

const fs = require('fs-extra');
const monorepo = require('./remark/remark-monorepo');
const path = require('path');
const remark = require('remark');
const lerna = require('../lerna.json');

const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const REPO_URL_BASE =
  'https://github.com/IBM/carbon-elements/tree/master/packages';

// This is our default set of keywords to include in each `package.json` file
const DEFAULT_KEYWORDS = [
  'ibm',
  'elements',
  'carbon',
  'carbon-elements',
  'carbon-design-system',
];

// We're going to use this in our `sortFields` method. The idea is that we want
// our `package.json` files to be ordered in the order given in this array. To
// accomplish this, we create an object where we can reference the value
// assigned to a field when sorting. By default, highest priority fields start
// with 1 and go up. Unknown fields are all given the same priority, which is
// just the length of the array + 1. When we use `sortFields` we are checking
// for the value from `packageJsonFields` and comparing it with the other value.
const packageJsonFields = [
  'name',
  'private',
  'description',
  'version',
  'license',
  'main',
  'module',
  'repository',
  'bugs',
  'files',
  'keywords',
  'publishConfig',
  'scripts',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'sideEffects',
  'eyeglass',
].reduce(
  (acc, key, index) => ({
    ...acc,
    [key]: index + 1,
  }),
  {}
);
const UNKNOWN_FIELD = packageJsonFields.length + 1;
function sortFields(a, b) {
  const aValue = packageJsonFields[a] || UNKNOWN_FIELD;
  const bValue = packageJsonFields[b] || UNKNOWN_FIELD;
  return aValue - bValue;
}

async function sync() {
  const packagePaths = await Promise.all(
    (await fs.readdir(PACKAGES_DIR)).map(async pkg => {
      const packageJsonPath = path.join(PACKAGES_DIR, pkg, 'package.json');
      return {
        basename: pkg,
        filepath: packageJsonPath,
        file: await fs.readJson(packageJsonPath),
        packagePath: path.join(PACKAGES_DIR, pkg),
      };
    })
  );

  const packages = await Promise.all(
    packagePaths.map(async ({ basename, filepath, file, ...rest }) => {
      file.version = lerna.version;
      file.repository = `${REPO_URL_BASE}/${basename}`;
      file.bugs = 'https://github.com/IBM/carbon-elements/issues';
      file.license = 'Apache-2.0';
      file.publishConfig = {
        access: 'public',
      };

      if (Array.isArray(file.keywords)) {
        const keywordsToAdd = DEFAULT_KEYWORDS.filter(keyword => {
          return file.keywords.indexOf(keyword) === -1;
        });
        if (keywordsToAdd.length > 0) {
          file.keywords = [...file.keywords, ...keywordsToAdd];
        }
      } else {
        file.keywords = DEFAULT_KEYWORDS;
      }

      // Construct our new packageJson file with sorted fields
      const packageJson = Object.keys(file)
        .sort(sortFields)
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: file[key],
          }),
          {}
        );

      await fs.writeJson(filepath, packageJson, { spaces: 2 });
      return {
        ...rest,
        basename,
        filepath,
        packageJson,
      };
    })
  );

  await Promise.all(
    packages.map(async ({ packageJson, packagePath }) => {
      const README_PATH = path.join(packagePath, 'README.md');
      if (!(await fs.pathExists(README_PATH))) {
        return;
      }

      const readme = await fs.readFile(README_PATH, 'utf8');
      const file = await process(packagePath, readme);
      await fs.writeFile(README_PATH, String(file));
    })
  );
}

let _remark;

function process(cwd, contents) {
  if (!_remark) {
    _remark = remark()
      .use(monorepo, {
        root: path.resolve(__dirname, '../'),
      })
      .use(require('remark-word-wrap'));
  }
  return new Promise((resolve, reject) => {
    _remark.process({ cwd, contents }, (error, file) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(file);
    });
  });
}

// eslint-disable-next-line no-console
sync().catch(error => console.error(error));
