'use strict';

const readline = require('readline');

const CLEAR_WHOLE_LINE = 0;
const CLEAR_RIGHT_OF_CURSOR = 1;
const CLEAR_LEFT_OF_CURSOR = -1;

function writeOnNthLine(stdout, n, message) {
  if (n === 0) {
    readline.cursorTo(stdout, 0);
    stdout.write(message);
    readline.clearLine(stdout, CLEAR_RIGHT_OF_CURSOR);
    readline.cursorTo(stdout, stdout.columns - 1);
    return;
  }

  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, n);
  stdout.write(message);
  readline.clearLine(stdout, CLEAR_RIGHT_OF_CURSOR);
  readline.moveCursor(stdout, 0, -n);
  readline.cursorTo(stdout, stdout.columns - 1);
}

module.exports = {
  CLEAR_RIGHT_OF_CURSOR,
  CLEAR_LEFT_OF_CURSOR,
  CLEAR_WHOLE_LINE,
  writeOnNthLine,
};
