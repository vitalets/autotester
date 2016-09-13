/**
 * Extra custom commands
 */

let done = false;

exports.setup = function () {
  if (!done) {
    done = true;
    require('./switch-to').setup();
    require('./requests-collector').setup();
  }
};
