/**
 * Internal event emitter
 */

const Channel = require('chnl');

exports.onTestsRun = new Channel();
exports.onTestsDone = new Channel();
