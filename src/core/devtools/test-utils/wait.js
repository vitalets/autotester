window.wait = {
  /**
   * Waits for specified ms
   * @param {Number} ms
   * @returns {Promise}
   */
  ms(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  },
  s(s) {
    return wait.ms(s * 1000);
  }
};
