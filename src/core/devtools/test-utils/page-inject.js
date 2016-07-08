/**
 * Scripts injected into tested page
 */

window.autotester = {
  /**
   * Returns DOM element
   * @param {String} selector
   * @param {Number} index
   */
  elem(selector, index = 0) {
    const elms = document.querySelectorAll(selector);
    if (!elms.length) {
      throw new Error(`Elements not found for ${selector}`);
    } else if (index >= elms.length) {
      throw new Error(`Elements count for ${selector} ${elms.length} is less than index ${index}`);
    }
    return elms[index];
  }
};
