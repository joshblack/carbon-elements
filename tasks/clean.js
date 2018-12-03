'use strict';

const {
  createProcess,
  count,
  preorder,
  IDLE,
  RUNNING,
  COMPLETED,
  FAILED,
} = require('@carbon/cli-reporter/process');
const chalk = require('chalk');
const readline = require('readline');
const { createSpinner } = require('./tools/spinner');
const { CLEAR_RIGHT_OF_CURSOR, writeOnNthLine } = require('./tools/tty');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const { stdout } = process;

const getSpinnerFrame = createSpinner();

async function clean() {
  const tree = createProcess('root');

  tree.addChildProcesses([
    createProcess(
      'p1',
      log => {
        log('Executing p1');
        return sleep(1000);
      },
      [
        createProcess(
          'p1a',
          log => {
            log('Executing p1a');
            return sleep(2000);
          },
          [
            createProcess('p1aa', log => {
              log('Executing p1aa');
              return sleep(1000);
            }),
          ]
        ),
        createProcess(
          'p1b',
          log => {
            log('Executing p1b');
            return sleep(3000);
          },
          [
            createProcess('p1ba', async log => {
              log('Executing p1ba');
              await sleep(1000);
              log('Executing p1ba 1');
              await sleep(1000);
              log('Executing p1ba 2');
              await sleep(1000);
              log('Executing p1ba 3');
              await sleep(1000);
            }),
            createProcess('p1bb', log => {
              log('Executing p1bb');
              return sleep(3000);
            }),
          ]
        ),
        createProcess('p1c', log => {
          log('Executing p1c');
          return sleep(5000);
        }),
      ]
    ),
    createProcess('p2', log => {
      log('Executing p2');
      return sleep(1500);
    }),
  ]);

  // ─
  // │
  // ├
  // └

  const total = count(tree) - 1;
  for (let i = 0; i < total; i++) {
    stdout.write('\n');
  }

  // Reset cursor to starting point
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, -total);

  let timeoutId = setTimeout(write, 60);

  const order = [...preorder(tree)];

  function flush() {
    const frame = getSpinnerFrame();
    order.forEach((step, index) => {
      const { depth, end, node, start } = step;

      if (depth === 0) {
        writeOnNthLine(stdout, index, node.name);
        return;
      }

      const status = {
        [IDLE]: '↓',
        [RUNNING]: frame,
        [COMPLETED]: chalk.green('✔'),
        [FAILED]: chalk.red('✘'),
      };
      const { messages, timing, state } = node;
      const name = state.value === IDLE ? chalk.gray(node.name) : node.name;
      const message = `${status[state.value]} ${name}`;
      const id = end ? `└ ${name}` : `├ ${name}`;
      const prefix = end ? '└ ' : '├ ';
      const suffix =
        state.value === COMPLETED
          ? chalk.gray(` (${timing.end - timing.start}ms)`)
          : '';
      const indent = '│ '.repeat(depth - 1);

      if (messages.length > 0) {
        writeOnNthLine(
          stdout,
          index,
          indent +
            prefix +
            message +
            `: ${chalk.gray(messages[messages.length - 1])}` +
            suffix
        );
      } else {
        writeOnNthLine(stdout, index, indent + prefix + message + suffix);
      }
    });
  }

  function write() {
    flush();
    timeoutId = setTimeout(write, 60);
  }

  await tree.run();

  clearTimeout(timeoutId);
  flush();

  // Reset cursor position after work
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, total);
  console.log();
  stdout.write('Done! ✨\n');
}

clean().catch(error => {
  console.error(error);
});
