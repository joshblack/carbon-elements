'use strict';

const { reporter } = require('@carbon/cli-reporter');
const { createTask } = require('@carbon/cli-reporter/task');
const { exec } = require('child-process-promise');
const path = require('path');
const { getPackages } = require('./tools/packages');

const defaultOptions = {
  cwd: path.resolve(__dirname, '../'),
};

async function clean() {
  // reporter.info('Cleaning environment...');
  // reporter.success('Done! ✨');
  const packages = await getPackages();
  const result = await createTask('packages', async log => {
    log('Running packages');
    const results = await Promise.all(
      packages.slice(0, 2).map(pkg =>
        createTask(pkg.packageJson.name, async log => {
          log('Running:', pkg.packageJson.name);
          const result = pkg.packageJson.name;
          return createTask(result + '-subtask', () => {
            return pkg.packageJson.name + '-subtask';
          });
        })
      )
    );
    log('Completed packages');
    return results;
  });

  // console.log(result);

  return;

  await Promise.all(
    packages.map(pkg => {
      const { examples } = pkg;
      if (examples.length === 0) {
        return;
      }

      return Promise.all(
        examples.map(async example => {
          const { filepath, packageJson } = example;

          if (packageJson.scripts.clean) {
            await exec('yarn clean', {
              cwd: filepath,
            });
          }

          await exec(
            'rm -rf .cache build dist node_modules stories storybook-static',
            {
              cwd: filepath,
            }
          );
        })
      );
    })
  );

  await exec('yarn lerna run clean', defaultOptions);
  await exec('yarn lerna clean --yes', defaultOptions);
  await exec('rm -rf build', defaultOptions);
  await exec('rm -rf node_modules', defaultOptions);

  reporter.success('Done! ✨');
}

clean().catch(error => {
  console.error(error);
});
