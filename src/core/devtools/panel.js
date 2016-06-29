
page.getUrl().then(url => {
  console.log('Autotester opened for tab', chrome.devtools.inspectedWindow.tabId, url);
  // window.requestCollector = new RequestCollector('nkcpopggjcjkiicpenikeogioednjeac');
  readTests();
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
  setError('');
  document.getElementById('mocha').innerHTML = '';
  new TestRunner().run([
    '/tests/actions.js',
    '/tests/sample.test.js'
  ]);
}

function readTests() {
  return utils.loadScript('/tests/index.js')
    .then(() => {
      console.log('config', window.autotesterConfig);
    })
}

