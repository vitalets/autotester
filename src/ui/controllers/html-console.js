
const Console = require('../../utils/console');
const {onConsoleMessage, onConsoleClear} = require('./internal-channels');

/**
 * For that error we show additional warning with link to chrome://flags
 */
const CHROME_URL_ACCESS_ERROR = 'Cannot access a chrome-extension:// URL of different extension';

let instance = null;

exports.init = function () {
  instance = new Console();
  instance.onMessage = onMessage;
  instance.onClear = () => onConsoleClear.dispatch();
};

exports.getInstance = function () {
    return instance;
};

function onMessage(data) {
  checkChromeUrlAccessError(data);
  onConsoleMessage.dispatch(data);
}

function checkChromeUrlAccessError(data) {
  if (data.type === 'error' && data.args.length && data.args[0].text.indexOf(CHROME_URL_ACCESS_ERROR) >= 0) {
    onConsoleMessage.dispatch({type: 'warn', args: [
      'Please enable chrome flag to allow debug of extensions',
      'chrome://flags/#extensions-on-chrome-urls'
    ]});
  }
}
