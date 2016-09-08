/**
 * Persistent storage wrapper (currently use localStorage)
 */

const DEFAULTS = {
  sourceType: 'extension', // from where take tests: snippet|extension|url
  baseUrl: 'tests',
  //baseUrl: 'filesystem:chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/persistent/',
  //baseUrl: 'http://127.0.0.1:8080',
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
