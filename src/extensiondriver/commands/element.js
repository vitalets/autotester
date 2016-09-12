/**
 * Commands for getting element props
 */

const WebElement = require('selenium-webdriver/lib/webdriver').WebElement;
const Targets = require('../targets');
const evaluate = require('./evaluate');

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
 * Returns props of node
 * @param {String} id
 * @returns {Promise}
 */
exports.getProps = function (id) {
  return Promise.resolve()
    .then(() => evaluate.helper.resolveNode(id))
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

/**
 * Submit form or element
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise}
 */
exports.submit = function (params) {
  const args = [WebElement.buildId(params.id)];
  const script = `
    const el = arguments[0];
    if (el.tagName === 'FORM') {
      el.submit();
    } else {
      el.form.submit();
    }
  `;
  return evaluate.executeScript({script, args});
};
