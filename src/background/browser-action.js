/**
 * Setup browser action to open Autotester UI
 */

const thenChrome = require('then-chrome');

exports.setup = function () {
  chrome.browserAction.onClicked.addListener(onClicked);
};

function onClicked() {
  const url = chrome.runtime.getURL('core/ui/ui.html');
  return thenChrome.tabs.query({url})
    .then(tabs => {
      return tabs.length
        ? thenChrome.tabs.update(tabs[0].id, {active: true})
        : thenChrome.tabs.create({url});
    });
}
