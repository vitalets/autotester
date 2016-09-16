/**
 * Requests module for webdriver
 * Collects network requests
 */

const Collector = require('./collector');

let collector;

exports.collect = function () {
  return Promise.resolve()
    .then(() => collector ? collector.stop() : null)
    .then(() => {
      collector = new Collector();
      return collector.start();
    });
};

exports.stop = function () {
  return Promise.resolve()
    .then(() => collector ? collector.stop() : null)
};

exports.get = function (params) {
  return Promise.resolve()
    .then(() => collector ? collector.get(params.filter) : Promise.reject('Collector was not started'))
};

