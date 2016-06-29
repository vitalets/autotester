
console.log('Autotester panel opened for tab:', chrome.devtools.inspectedWindow.tabId);

document.getElementById('reload').addEventListener('click', () => {
  console.clear();
  BackgroundProxy.call({
    path: 'chrome.runtime.reload',
    async: false
  });
  setTimeout(() => window.location.reload(), 200);
  setTimeout(() => inspected.eval('window.location.reload()'), 300);
});

document.getElementById('run').addEventListener('click', () => {
  document.getElementById('mocha').innerHTML = '';

  // callProxy('chrome.tabs.update', chrome.devtools.inspectedWindow.tabId, {url: 'chrome://flags'});
  // inspected.eval('chrome.management.uninstallSelf()');


  new TestRunner().run([
    '/tests/actions.js',
    '/tests/prepare.js',
    '/tests/sample.test.js'
  ]);


});

// window.requestCollector = new RequestCollector('nkcpopggjcjkiicpenikeogioednjeac');

/*
 document.querySelector('#silent-debugger-extension-api a.experiment-enable-link').click()
 document.querySelector('#silent-debugger-extension-api a.experiment-disable-link').style.display === 'none';
 document.querySelector('.experiment-restart-button').click();
 */
