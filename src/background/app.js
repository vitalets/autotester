/**
 * Background entry point
 */

const thenChrome = require('then-chrome');
const runner = require('../driver/runner');
const tests = require('../../test');
const TestsLoader = require('./tests-loader');
const messaging = require('./messaging');
const browserAction = require('./browser-action');

browserAction.setup();
messaging.start();

messaging.on(messaging.names.RUN, data => {
  console.log(chrome.extension.getViews({type: 'tab'}));
  const testsLoader = new TestsLoader('/test');
  testsLoader.loadConfig().then(config => {
    console.log(config);
    runner.run(config.tests, config.prepare)
       // .then();
  });

});


