/**
 * Internal event emitter
 */

const Channel = require('chnl');

exports.onTestsRun = new Channel();
exports.onTestsDone = new Channel();
exports.onSessionStarted = new Channel();
exports.onFileStarted = new Channel();
exports.onTestStarted = new Channel();
exports.onError = new Channel();
exports.onConsoleMessage = new Channel();
exports.onConsoleClear = new Channel();
