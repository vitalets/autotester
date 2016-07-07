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
      throw new Error(`Elements not found for ${selector}`);
    } else if (index >= elms.length) {
      throw new Error(`Elements count for ${selector} ${elms.length} is less than index ${index}`);
    }
    return elms[index];
  },
  elemProp(selector, prop = '') {
    const el = autotester.el(selector);
    return prop.split('.').reduce((res, propItem) => res[propItem], el);
  }
};
