/**
 * Load and run tests in the inspected tab.
 *
 * 1. Load testing stuff into panel context:
 *   - mocha
 *   - chai
 * 2. Load testing stuff into inspected tab:
 *   - syn.js: for emulating user actions
 *   - ...
 * 3. Load specs from urls
 * 4. Run mocha!
 */

/**
 * As functional tests are slow, set mocha timeout to 10s
 */
const TIMEOUT_MS = 10 * 1000;

class TestRunner {
  run(specUrls) {
    console.log('running tests', specUrls);
    return Promise.resolve()
      // can not run mocha twice, so re-load script every time
      // see https://github.com/mochajs/mocha/issues/995
      .then(() => utils.loadScript('/libs/mocha.js'))
      // reload chai just for consistency here
      .then(() => utils.loadScript('/libs/chai.js'))
      .then(() => {
         window.mocha.setup({ui: 'bdd', timeout: TIMEOUT_MS});
         window.assert = chai.assert;
      })
      .then(() => {
        const tasks = specUrls.map(url => utils.loadScript(url));
        return Promise.all(tasks);
      })
      .then(() => mocha.run())
      .catch(e => console.error(e));
  }
}
