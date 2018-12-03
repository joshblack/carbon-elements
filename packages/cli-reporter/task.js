'use strict';

const { createProcess, print } = require('./process');

// let currentProcess = null;

// async function createTask(name, thunk) {
// console.log('Current:', currentProcess && currentProcess.name);
// console.log('Name:', name);
// const p = createProcess(name, thunk);
// let isRootProcess = false;

// if (!currentProcess) {
// currentProcess = p;
// isRootProcess = true;
// }

// if (!isRootProcess) {
// currentProcess.addChildProcesses([p]);
// }

// let result;
// if (!isRootProcess) {
// const prevCurrentProcess = currentProcess;
// currentProcess = p;
// result = await p.run();
// currentProcess = prevCurrentProcess;
// } else {
// result = await p.run();
// }

// return result;

// const p = createProcess(name, thunk);
// let isRootTask = false;
// let stop = null;
// if (root) {
// currentProcess.addChildProcesses([p]);
// } else {
// isRootTask = true;
// root = p;
// currentProcess = root;
// }
// if (isRootTask) {
// const options = print(root);
// stop = options.stop;
// }
// const prevProcess = currentProcess;
// currentProcess = p;
// const result = await p.run();
// currentProcess = prevProcess;
// if (isRootTask) {
// root = null;
// stop();
// }
// return result;
// }
//

let parentCurrentProcess;

async function createTask(name, thunk) {
  const p = createProcess(name, thunk);
  console.log(name);
  const result = await p.run();

  return result;
}

module.exports = {
  createTask,
};
