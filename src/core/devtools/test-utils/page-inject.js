/**
 * Scripts injected into tested page
 */

window.autotester = {
  /**
   * Returns DOM element
   * @param {String} selector
   * @param {Number} index
   */
  el(selector, index = 0) {
    const elms = document.querySelectorAll(selector);
    if (!elms.length) {
      throw new Error(`Elements not found ${selector}`);
    } else if (index >= elms.length) {
      throw new Error(`Elements count ${selector} %i is less than expected index %i`, elms.length, index);
    }
    return elms[index];
  }
};
