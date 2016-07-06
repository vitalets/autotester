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
 * As functional tests are slow, increase timeout
 */
const TIMEOUT_MS = 30 * 1000;

window.testRunner = {
  configure(config = {}) {
    this.config = Object.assign({
      runner: 'mocha',
      assert: 'chai',
      prepare: [],
      tests: [],
      baseUrl: ''
    }, config);
    this.parsedTests = this._parseTests(this.config.tests, 0);
  },
  run(testIndex) {
    this.clearReport();
    return Promise.resolve()
      .then(() => this._loadFrameworks())
      .then(() => this._loadPrepare())
      .then(() => this._loadTests(testIndex))
      .then(() => this._runTests());
  },
  clearReport() {
    document.querySelector('.report').innerHTML = '';
  },
  _loadFrameworks() {
    return Promise.all([
      // can not run mocha twice, so re-load script every time
      // see https://github.com/mochajs/mocha/issues/995
      utils.loadScript('/libs/mocha.js'),
      // reload chai just for consistency here
      utils.loadScript('/libs/chai.js')
    ]).then(() => {
      window.mocha.setup({ui: 'bdd', timeout: TIMEOUT_MS});
      window.assert = chai.assert;
    });
  },
  _loadPrepare() {
    return this.config.prepare
      .map(url => this._addBaseUrl(url))
      .reduce((res, url) => res.then(() => utils.loadScript(url)), Promise.resolve());
  },
  _loadTests(testIndex) {
    testIndex = parseInt(testIndex, 10);
    const urls = Number.isNaN(testIndex) ? this.parsedTests.urls : this.parsedTests.objects[testIndex].urls;
    console.log(`Running ${urls.length} test file(s)`);
    const tasks = urls
      .map(url => this._addBaseUrl(url))
      .map(url => utils.loadScript(url));
    return Promise.all(tasks);
  },
  _runTests() {
    return new Promise(resolve => mocha.run(resolve));
  },
  _addBaseUrl(url) {
    return /^https?:\/\//i.test(url) ? url : `${this.config.baseUrl}/${url.replace(/^\//, '')}`;
  },
  _parseTests(arr, level = 0) {
    return arr.reduce((res, item) => {
      if (!item) {
        return res;
      }

      // convert string item to object
      if (typeof item === 'string') {
        item = {tests: item, label: item};
      }

      // single item
      if (typeof item.tests === 'string') {
        res.objects.push({level, urls: [item.tests], label: item.label || item.tests});
        res.urls.push(item.tests);
      }

      // group of tests
      if (Array.isArray(item.tests)) {
        const nested = this._parseTests(item.tests, level + 1);
        const group = {level, urls: nested.urls, label: item.label || item.tests};
        res.objects.push(group);
        res.objects = res.objects.concat(nested.objects);
        res.urls = res.urls.concat(nested.urls);
      }

      return res;
    }, {objects: [], urls: []});
  }
};
