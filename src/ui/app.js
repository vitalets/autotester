
const runner = require('../driver/runner');
const tests = require('../../test');
const TestsLoader = require('./tests-loader');

//runner.run(tests);

const testsLoader = new TestsLoader('/test');

testsLoader.loadConfig().then(config => {
  //console.log(config);
  runner.run(config.tests, config.prepare);
});
