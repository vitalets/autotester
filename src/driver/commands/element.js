/**
 * Commands for getting element props
 */

const TargetManager = require('../target-manager');

/**
 * Returns element tag name
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise}
 */
exports.getElementTagName = function (params) {
  return Promise.resolve()
    .then(() => TargetManager.debugger.sendCommand('DOM.getOuterHTML', {
      nodeId: Number(params.id)
    }))
    .then(res => res.outerHTML.match(/^<([^ ]+)/)[1].toLowerCase());
};
