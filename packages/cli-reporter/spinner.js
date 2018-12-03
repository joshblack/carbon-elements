'use strict';

const { dots } = require('cli-spinners');

function createSpinnerFrom(frames) {
  const total = frames.length;
  let prevFrame = -1;

  return () => {
    return frames[(prevFrame++ + 1) % total];
  };
}

module.exports = {
  createSpinner: () => createSpinnerFrom(dots.frames),
};
