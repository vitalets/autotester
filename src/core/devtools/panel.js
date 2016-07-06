
const TESTS_BASE_URL = '/tests';

// entry
init();

function init() {
  page.getUrl().then(url => {
    console.log('Autotester opened for tab', chrome.devtools.inspectedWindow.tabId, url);
    setDomListeners();
    readTestsConfig()
      .then(() => {
        // add baseUrl for loading tests
        window.autotesterConfig.baseUrl = TESTS_BASE_URL;
        testRunner.configure(window.autotesterConfig);
        fillTestList(testRunner.parsedTests.objects);
        const count = testRunner.parsedTests.objects.length;
        infoblock.success(`<b>${count}</b> test(s) loaded. Press <b>Run</b> to start awesome testing.`);
      }, e => {
        // todo: use instanceof for error checking
        if (e.message.indexOf('Can not load') >= 0) {
          infoblock.success('Configuration file <b>/tests/index.js</b> not found. Is it exists?');
        } else {
          return Promise.reject(e);
        }
      });
  });
}

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
  // setTimeout(() => page.reload(), 600);
}

function runTests() {
  infoblock.clear();
  setUiEnabled(false);
  const testIndex = document.getElementById('testlist').value;
  testRunner.run(testIndex)
    .then(afterRun)
    .catch(e => {
      afterRun();
      return Promise.reject(e);
    });
}

function afterRun() {
  fiddler.stop();
  setUiEnabled(true);
}

function readTestsConfig() {
  return utils.loadScript(`${TESTS_BASE_URL}/index.js`);
}

function fillTestList(tests) {
  const el = document.getElementById('testlist');
  el.options.length = 0;
  el.options[el.options.length] = new Option('All', '');
  tests.forEach((test, index) => {
    const label = '-'.repeat(test.level * 3) + test.label;
    el.options[el.options.length] = new Option(label, index);
  });
}

function setUiEnabled(enabled) {
  document.getElementById('testlist').disabled = !enabled;
  document.getElementById('run').disabled = !enabled;
}
