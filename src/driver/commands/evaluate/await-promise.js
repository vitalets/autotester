/**
 * Pings remote promise object until it fulfilled
 * This should be replaced with option 'awaitPromise: true' in protocol > 1.1
 */

const helper = require('./helper');

/**
 * Waits promise to be fulfilled
 * @param {String} promiseObjectId
 */
module.exports = function awaitPromise(promiseObjectId) {
  return helper.getOwnProperties(promiseObjectId)
    .then(res => {
      const result = checkStatus(res);
      return result
        ? result
        : helper.wait(50).then(() => awaitPromise(promiseObjectId));
    })
};

function checkStatus(res) {
  const status = res.internalProperties[0].value.value;
  const result = res.internalProperties[1].value;
  switch (status) {
    case 'resolved':
      return Promise.resolve(result);
    case 'rejected':
      //if (result.type === 'object') {
      //  throw new Error(result.description);
      //}
      return Promise.reject(result);

    case 'pending':
    default:
      return null;
  }
}

