/**
 * Background entry point
 */

const thenChrome = require('then-chrome');
const runner = require('../driver/runner');
const tests = require('../../test');
const TestsLoader = require('./tests-loader');
const messaging = require('./messaging');
const browserAction = require('./browser-action');
const htmlReporter = require('../reporter/html');

browserAction.setup();
messaging.start();

messaging.on(messaging.names.RUN, data => {
  const testsLoader = new TestsLoader('/test');
  testsLoader.loadConfig().then(config => {
    console.log(config);
    const views = chrome.extension.getViews({type: 'tab'});
    const runnerParams = {
      testUrls: config.tests,
      prepareUrls: config.prepare,
      reporter: htmlReporter.getReporter(views[0])
    };
    runner.run(runnerParams);
       // .then();
  });

});


