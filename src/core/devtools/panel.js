
const TESTS_BASE_URL = '/tests';

// entry
init();

function init() {
  page.getUrl().then(url => {
    console.log('Autotester opened for tab', chrome.devtools.inspectedWindow.tabId, url);
    setDomListeners();
    window.testRunner = new TestRunner();
    readTests().then(() => {
      window.autotesterConfig.baseUrl = TESTS_BASE_URL;
      testRunner.configure(window.autotesterConfig);
      fillTestList(testRunner.parsedTests.objects);
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
  setTimeout(() => page.reload(), 600);
}

function runTests() {
  setError('');
  const testIndex = document.getElementById('testlist').value;
  testRunner.run(testIndex);
}

function readTests() {
  return utils.loadScript(`${TESTS_BASE_URL}/index.js`);
}

function fillTestList(tests) {
  const el = document.getElementById('testlist');
  el.options[el.options.length] = new Option('All tests', '');
  tests.forEach((test, index) => {
    const label = '-'.repeat(test.level * 3) + test.label;
    el.options[el.options.length] = new Option(label, index);
  });
}
