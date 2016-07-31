
const thenChrome = require('then-chrome');

const runner = require('../driver/runner');
const tests = require('../../test');
const TestsLoader = require('./tests-loader');

//runner.run(tests);

const testsLoader = new TestsLoader('/test');

testsLoader.loadConfig().then(config => {
  //console.log(config);
  runner.run(config.tests, config.prepare)
    .then(activateSelfTab);
});

function activateSelfTab() {
  return thenChrome.tabs.getCurrent()
    .then(tab => thenChrome.tabs.update(tab.id, {active: true}));
}
