/**
 * Internal channels
 */

const Channel = require('chnl');

exports.onReady = new Channel();
exports.onTestsDone = new Channel();
exports.onSessionStarted = new Channel();
exports.onFileStarted = new Channel();
exports.onTestStarted = new Channel();
