
// filled if testing extension page
let extensionId = '';

// entry
page.getUrl().then(url => {
  console.log('Autotester opened on tab', chrome.devtools.inspectedWindow.tabId, url);
  const parsedUrl = new URL(url);
  extensionId = parsedUrl.protocol === 'chrome-extension:' ? parsedUrl.hostname : '';
  setDomListeners();
});

function setDomListeners() {
  document.getElementById('reload').addEventListener('click', reload);
  document.getElementById('run').addEventListener('click', runTests);
}

function reload() {
  console.clear();
  // reload self background
  BackgroundProxy.call({path: 'chrome.runtime.reload', async: false});
  // timeouts needed for background to get ready
  setTimeout(() => window.location.reload(), 500);
  setTimeout(() => page.reload(), 600);
}

function runTests() {
  document.getElementById('mocha').innerHTML = '';
  new TestRunner().run([
    '/tests/actions.js',
    '/tests/sample.test.js'
  ]);
}

// window.requestCollector = new RequestCollector('nkcpopggjcjkiicpenikeogioednjeac');

/*
 document.querySelector('#silent-debugger-extension-api a.experiment-enable-link').click()
 document.querySelector('#silent-debugger-extension-api a.experiment-disable-link').style.display === 'none';
 document.querySelector('.experiment-restart-button').click();
 */
