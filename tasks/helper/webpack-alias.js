/**
 * Alias some node packages as they can not be required in browser context
 * Used with NormalModuleReplacementPlugin
 */

'use strict';

const path = require('path');
const normalizePath = require('normalize-path');

const aliases = [
  {
    beforeResolve: true,
    request: 'fs',
    replace: './src/alias/fs.js',
  },
  {
    beforeResolve: true,
    request: 'child_process',
    replace: './src/alias/child_process.js',
  },
  {
    beforeResolve: true,
    request: 'adm-zip',
    replace: './src/alias/adm-zip.js',
  },
  {
    beforeResolve: true,
    request: 'ws',
    replace: './src/alias/adm-zip.js',
  },
  {
    beforeResolve: true,
    request: 'http',
    replace: './src/alias/http.js',
  },
  {
    request: 'selenium-webdriver/net/portprober.js',
    replace: './src/alias/portprober.js',
  },
  {
    request: 'selenium-webdriver/io/index.js',
    replace: './src/alias/io.js',
  },
  {
    request: 'selenium-webdriver/io/exec.js',
    replace: './src/alias/exec.js',
  },
];

exports.newResource = function (data) {
  for (let i = 0; i < aliases.length; i++) {
    const alias = aliases[i];
    const request = normalizePath(data.request);
    const isMatched = (alias.beforeResolve && alias.request === request)
      || (!alias.beforeResolve && request.endsWith(alias.request));
    if (isMatched) {
      // console.log(`Replace ${data.rawRequest || data.request} in ${data.context}`);
      // In before-resolve overwrite data.request as file actually does not exist and after-resolve will not occur
      data[alias.beforeResolve ? 'request' : 'resource'] = path.resolve(alias.replace);
      break;
    }
  }
};
