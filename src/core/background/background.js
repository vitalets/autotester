
BackgroundProxy.listen();

window.debuggerBgRequestCatcher = new DebuggerRequestCatcher();
window.debuggerTabRequestCatcher = new DebuggerRequestCatcher();
window.webRequestCatcher = new WebRequestCatcher();
window.tabLoader = new TabLoader();
window.tabCatcher = new TabCatcher();

setBrowserAction();

console.log('Autotester background started');

/*
 fetch('http://yandex.ru');

 a = new XMLHttpRequest();
 a.open('GET', 'http://ya.ru');
 a.send(null);
 */

function setBrowserAction() {
  chrome.browserAction.onClicked.addListener(() => {
    const url = chrome.runtime.getURL('/core/runner/runner.html');
    chrome.tabs.query({url}, tabs => {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, {active: true});
      } else {
        chrome.tabs.create({url});
      }
    });
  });
}
