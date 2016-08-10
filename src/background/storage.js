/**
 * Persistent storage wrapper (currently use localStorage)
 */

const DEFAULTS = {
  sourceType: 'url', // from whare take tests
  baseUrl: 'test',   // base url for loading tests for sourceType = 'url'
  selectedTest: '',  // currently selected test
};

exports.get = function (key) {
  assertKey(key);
  return localStorage.getItem(key) || DEFAULTS[key];
};

exports.set = function (key, value) {
  assertKey(key);
  localStorage.setItem(key, value);
};

function assertKey(key) {
  if (!DEFAULTS.hasOwnProperty(key)) {
    throw new Error(`Unknown storage key ${key}`);
  }
}
