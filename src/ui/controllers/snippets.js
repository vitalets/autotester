/**
 * Working with snippets
 */

const thenChrome = require('then-chrome');

exports.loadSnippet = function (snippetId) {
  const key = exports.getKey(snippetId);
  return thenChrome.storage.local.get(key)
    .then(data => data[key])
};

exports.saveSnippet = function (snippetId, name, code) {
  const key = exports.getKey(snippetId);
  const data = {
    [key]: {name, code}
  };
  return thenChrome.storage.local.set(data);
};

exports.removeSnippet = function (snippetId) {
  const key = exports.getKey(snippetId);
  return thenChrome.storage.local.remove(key);
};

exports.getKey = function (snippetId) {
  return `snippet-${snippetId}`;
};

// temp
/*

var data = {
  snippets: [
  {
    id: 'snippet1',
    name: 'Google search test',
    code: `const driver = new Driver();
driver.get('http://google.com');
driver.sleep(2000);
driver.quit();`
  },
  {
    id: 'snippet2',
    name: 'Yandex search test',
    code: `const driver = new Driver();
driver.get('http://yandex.ru');
driver.sleep(2000);
driver.quit();`
  }
  ]
};
chrome.storage.local.set(data);
chrome.storage.local.remove('selectedSnippet');

*/


