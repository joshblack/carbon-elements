'use strict';

const chalk = require('chalk');
const readline = require('readline');
const { CLEAR_RIGHT_OF_CURSOR, writeOnNthLine } = require('./tty');
const { createSpinner } = require('./spinner');

const IDLE = 0;
const RUNNING = 1;
const COMPLETED = 2;
const FAILED = 3;

let _id = 0;

function noop() {}

function createProcess(name, thunk = noop, childProcesses = []) {
  const children = [...childProcesses];
  const messages = [];
  const error = {
    value: null,
  };
  const timing = {
    start: null,
    end: null,
  };
  const state = {
    value: IDLE,
  };

  function log(message) {
    messages.push(message);
  }

  return {
    children,
    id: ++_id,
    messages,
    name,
    state,
    timing,
    thunk,

    addChildProcesses(processes) {
      children.push(...processes);
    },

    async run() {
      state.value = RUNNING;
      timing.start = Date.now();

      await Promise.all(children.map(child => child.run()));
      const result = await thunk(log);

      state.value = COMPLETED;
      timing.end = Date.now();

      return result;
    },
  };
}

function count(node) {
  return 1 + node.children.reduce((acc, child) => acc + count(child), 0);
}

function height(node, depth = 0) {
  if (node.children.length === 0) {
    return depth;
  }
  return Math.max(...node.children.map(child => height(child, depth + 1)));
}

function* preorder(node, depth = 0, start = true, end = false) {
  const details = {
    end,
    depth,
    node,
    start,
  };

  yield details;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    yield* preorder(child, depth + 1, i === 0, i === node.children.length - 1);
  }
}

function print(tree) {
  const { stdout } = process;
  const getSpinnerFrame = createSpinner();
  let timeoutId = setTimeout(write, 60);

  function flush() {
    const order = [...preorder(tree)];
    const total = count(tree) - 1;

    for (let i = 0; i < total; i++) {
      stdout.write('\n');
    }

    // Reset cursor to starting point
    readline.cursorTo(stdout, 0);
    readline.moveCursor(stdout, 0, -total);

    const frame = getSpinnerFrame();
    const status = {
      [IDLE]: '↓',
      [RUNNING]: frame,
      [COMPLETED]: chalk.green('✔'),
      [FAILED]: chalk.red('✘'),
    };

    order.forEach((step, index) => {
      const { depth, end, node, start } = step;
      const { messages, timing, state } = node;
      const name = state.value === IDLE ? chalk.gray(node.name) : node.name;
      const message = `${status[state.value]} ${name}`;
      const id = end ? `└ ${name}` : `├ ${name}`;
      const prefix = end ? '└ ' : '├ ';

      if (depth === 0) {
        writeOnNthLine(stdout, index, node.name);
        return;
      }

      const indent = '│ '.repeat(depth - 1);

      writeOnNthLine(stdout, index, indent + prefix + message);
    });
  }

  function write() {
    flush();
    timeoutId = setTimeout(write, 60);
  }

  return {
    stop() {
      clearTimeout(timeoutId);
      flush();

      // Reset cursor position after work
      readline.cursorTo(stdout, 0);
      readline.moveCursor(stdout, 0, count(tree) - 1);

      console.log();

      stdout.write('Done! ✨\n');
    },
  };
}

module.exports = {
  createProcess,
  count,
  height,
  preorder,
  print,
  IDLE,
  RUNNING,
  COMPLETED,
  FAILED,
};
