/**
 * Setup browser action to open Autotester UI
 */

const smartUrlOpener = require('../../utils/smart-url-opener');
const constants = require('../constants');

exports.setup = function () {
  chrome.browserAction.onClicked.addListener(() => smartUrlOpener.open(constants.UI_URL));
};
