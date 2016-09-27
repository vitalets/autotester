/**
 * Yandex selenium hub
 */

'use strict';

const capabilities = require('../capabilities');

const targets = [
  {
    'platform': 'WINDOWS',
    'version' : '53.0',
  },
  {
    'platform': 'LINUX',
    'version' : '51.0',
  },
];

if (!process.env.YANDEX_USER) {
  throw new Error('Empty: process.env.YANDEX_USER');
}

exports.name = 'yandex';
exports.serverUrl = `http://${process.env.YANDEX_USER}:${process.env.YANDEX_KEY}@sg.yandex-team.ru:4444/wd/hub`;
exports.capabilities = function () {
  return capabilities.get()
    .then(caps => {
      return targets.map(target => {
        return Object.assign({}, caps, target);
      });
    });
};
