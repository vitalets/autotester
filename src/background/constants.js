
const keyMirror = require('keymirror');

exports.TESTS_SOURCE_TYPE = keyMirror({
  SNIPPETS: null,
  URL: null,
  EMBEDED: null,
});

exports.UI_URL = chrome.runtime.getURL('core/ui/ui.html');
