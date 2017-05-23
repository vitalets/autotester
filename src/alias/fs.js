
exports.existsSync = function (file) {
  // if this file exists selenium-webdriver considers devmode=true
  if (file.endsWith('build.desc')) {
    return false;
  }
  throw new Error(`Alias not found fo fs.existsSync, file = ${file}`);
};

exports.readFile = function (file, mode, callback) {
  if (file.startsWith('/atoms/getAttribute.js')) {
    const content = require('raw-loader!selenium-webdriver/lib/atoms/getAttribute.js');
    callback(null, content);
    return;
  }
  if (file.startsWith('/atoms/is-displayed.js')) {
    const content = require('raw-loader!selenium-webdriver/lib/atoms/is-displayed.js');
    callback(null, content);
    return;
  }
  throw new Error(`Alias not found fo fs.readFile, file = ${file}`);
};

