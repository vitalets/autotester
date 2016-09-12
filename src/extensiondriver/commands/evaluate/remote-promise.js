/**
 * Pings remote promise object until it fulfilled
 * This should be replaced with option 'awaitPromise: true' in protocol > 1.1
 */

const helper = require('./helper');
const PING_MS = 50;

/**
 * Waits remote promise to be fulfilled
 * @param {String} promiseObjectId
 */
exports.wait = function (promiseObjectId) {
  return helper.getInternalProperties(promiseObjectId)
    .then(props => {
      const result = checkStatus(props);
      return result
        ? result
        : helper.wait(PING_MS).then(() => exports.wait(promiseObjectId));
    })
};

function checkStatus(props) {
  const status = props[0].value.value;
  const result = props[1].value;
  switch (status) {
    case 'resolved':
      return Promise.resolve(result);

    case 'rejected':
      if (result.subtype === 'error') {
        // todo: extract stack
      }
      return Promise.reject(result);

    case 'pending':
    default:
      return null;
  }
}

