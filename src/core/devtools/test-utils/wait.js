/**
 * Waits for specified ms
 * @param {Number} ms
 * @returns {Promise}
 */
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
