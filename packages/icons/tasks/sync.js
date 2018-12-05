'use strict';

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const search = require('../src/search');

const SVG_DIR = path.resolve(__dirname, '../src/svg');
const ICON_INFO_PATH = path.resolve(__dirname, '../src/icons.yml');

async function sync() {
  const files = await search(SVG_DIR);
  const icons = files.reduce((acc, file) => {
    const { basename } = file;
    const [name] = basename.split('--');
    if (!acc[name]) {
      return {
        ...acc,
        [name]: [file],
      };
    }

    return {
      ...acc,
      [name]: acc[name].concat(file),
    };
  }, {});
  const info = Object.keys(icons).map(key => {
    const variants = icons[key];
    return {
      name: key,
      description: 'TODO',
      usage: [],
      keywords: [],
    };
  });

  console.log(icons);

  // const info = yaml.safeLoad(await fs.readFile(ICON_INFO_PATH, 'utf8'));

  // console.log(JSON.stringify(info, null, 2));

  // const output = yaml.safeDump(info);
  // console.log(output);
}

sync().catch(error => {
  console.error(error);
});
