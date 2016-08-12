/**
 * Commands for getting element props
 */

const Targets = require('../targets');

/**
 * Returns element tag name
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise}
 */
exports.getElementTagName = function (params) {
  return exports.getProp(params.id, 'tagName')
    .then(tagName => tagName.toLowerCase());
};

/**
 * Returns element text
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise}
 */
exports.getElementText = function (params) {
  return exports.getProp(params.id, 'textContent');
};

/**
 * Resolves nodeId to ObjectId
 * @param {String} id
 */
exports.resolveNode = function (id) {
  return Targets.debugger.sendCommand('DOM.resolveNode', {
    nodeId: Number(id)
  })
  .then(res => res.object.objectId);
};

/**
 * Returns props of node
 * @param {String} id
 * @returns {Promise}
 */
exports.getProps = function (id) {
  return Promise.resolve()
    .then(() => exports.resolveNode(id))
    .then(objectId => {
      return Targets.debugger.sendCommand('Runtime.getProperties', {
        objectId: objectId,
      })
    })
    .then(res => res.result);
};

/**
 * Returns prop of node
 * @param {String} id
 * @param {String} propName
 * @returns {Promise}
 */
exports.getProp = function (id, propName) {
  return exports.getProps(id)
    .then(props => props.filter(prop => prop.name === propName)[0].value.value)
};
