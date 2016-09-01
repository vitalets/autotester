/**
 * Yandex selenium hub
 */

'use strict';

const capabilities = require('../capabilities');

const targets = [
  {
    'version' : '48.0',
  },
  // {
  //   'version' : '48.0',
  // },
];

exports.name = 'yandex';
exports.serverUrl = `http://selenium:selenium@sg.yandex-team.ru:4444/wd/hub`;
exports.capabilities = function () {
  return capabilities.remote()
    .then(caps => {
      return targets.map(target => {
        return Object.assign({}, caps, target);
      });
    });
};
