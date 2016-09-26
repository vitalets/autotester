/**
 * Global errors catcher
 */

const errorCatcher = require('../../utils/error-catcher');
const {onError} = require('./internal-channels');

exports.init = function () {
  errorCatcher.attach(window, e => {
    onError.dispatch(e);
  });
};

