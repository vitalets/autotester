
const Console = require('../../utils/console');
const {onConsoleMessage, onConsoleClear} = require('./internal-channels');

let instance = null;

exports.init = function () {
  instance = new Console();
  instance.onMessage = data => onConsoleMessage.dispatch(data);
  instance.onClear = () => onConsoleClear.dispatch();
};

exports.getInstance = function () {
    return instance;
};
