/*
 Examples of chorme.debugger commands:

 https://chromium.googlesource.com/experimental/chromium/blink/+/master/LayoutTests/inspector-protocol


 */


const TESTS_BASE_URL = '/tests';

// entry
init();

function init() {
  setDomListeners();

  /*
  page.getUrl().then(url => {
    console.log('Autotester opened for tab', chrome.devtools.inspectedWindow.tabId, url);
    // setDomListeners();
    readTestsConfig()
      .then(() => {
        // add baseUrl for loading tests
        window.autotesterConfig.baseUrl = TESTS_BASE_URL;
        testRunner.configure(window.autotesterConfig);
        fillTestList(testRunner.parsedTests.objects);
        const count = testRunner.parsedTests.objects.length;
        infoblock.success(`Tests loaded: <b>${count}</b>. Press <b>Run</b> to start awesome testing.`);
      }, e => {
        // todo: use instanceof for error checking
        if (e.message.indexOf('Can not load') >= 0) {
          infoblock.success('Configuration file <b>/tests/index.js</b> not found. Is it exists?');
        } else {
          return Promise.reject(e);
        }
      });
  });
  */
}

function setDomListeners() {
  document.getElementById('reload').addEventListener('click', reload);
  document.getElementById('run').addEventListener('click', runTests);
  document.body.addEventListener('click', event => {
    if (event.target.id === 'enable-flags') {
      enableFlags();
    }
  });
}

function reload() {
 // console.clear();
  // reload self background
  //BackgroundProxy.call({path: 'chrome.runtime.reload', async: false});
  // timeouts needed for background to get ready
  setTimeout(() => window.location.reload(), 500);
  // setTimeout(() => page.reload(), 600);
}

function runTests() {
  chrome.tabs.create({url: 'chrome://newtab'}, tab => {
    chrome.debugger.attach({tabId: tab.id}, '1.1', () => {
      console.log('attached');
      setTimeout(() => {
        chrome.debugger.sendCommand({tabId: tab.id}, 'DOM.enable', () => {
          console.log('dom enabled');

          chrome.debugger.sendCommand({tabId: tab.id}, 'DOM.getDocument', res => {
            console.log('getDocument', res);
          });

          chrome.debugger.sendCommand({tabId: tab.id}, 'DOM.querySelector', {nodeId: 1, selector: '[name="text"]'}, res => {
            console.log('querySelector', res);


            chrome.debugger.sendCommand({tabId: tab.id}, 'DOM.focus', {nodeId: res.nodeId}, res => {
              console.log('focus', res);

              chrome.debugger.sendCommand({tabId: tab.id}, 'Input.dispatchKeyEvent', {type: 'char', text: 'x'}, res => {
                console.log('dispatchKeyEvent', res);
                setTimeout( () => {
                  chrome.debugger.sendCommand({tabId: tab.id}, 'Input.dispatchKeyEvent', {
                    type: 'keyDown',
                    //keyIdentifier: 'U+000D'
                     nativeVirtualKeyCode: 13,
                     windowsVirtualKeyCode: 13
                  }, res => {
                    console.log('dispatchKeyEvent enter', res);
                  });
                }, 500);
              });
            });

          });


        })
      }, 2000);

    });
  });

  /*
  infoblock.clear();
  setUiEnabled(false);
  const testIndex = document.getElementById('testlist').value;
  testRunner.run(testIndex)
    .then(afterRun)
    .catch(e => {
      afterRun();
      return Promise.reject(e);
    });
  */
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

function enableFlags() {
  page.navigate('chrome://flags/')
    .then(() => wait.ms(500))
    .then(() => enableFlag('silent-debugger-extension-api'))
    .then(() => enableFlag('extensions-on-chrome-urls'))
    // restart chrome
    .then(() => page.elemProp('.needs-restart', 'style.display'))
    .then(display => display !== 'none' ? page.click('.experiment-restart-button') : '');
}

function enableFlag(flag) {
  const selector = `#${flag} .experiment-enable-link`;
  return Promise.resolve()
    .then(() => page.elemProp(selector, 'style.display'))
    .then(display => display !== 'none' ? page.click(selector) : '')
    .then(() => wait.ms(500))
}
