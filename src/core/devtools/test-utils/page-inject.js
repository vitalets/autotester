/**
 * Scripts injected into tested page
 */

window.autotester = {
  /**
   * Returns DOM element
   * @param {String} selector
   * @param {Number} index
   * @param {Boolean} throwError
   */
  elem(selector, index, throwError = true) {
    const elms = index ? document.querySelectorAll(selector) : [document.querySelector(selector)].filter(Boolean);
    if (throwError) {
      if (!elms.length) {
        throw new Error(`Elements not found for ${selector}`);
      } else if (index >= elms.length) {
        throw new Error(`Elements count for ${selector} ${elms.length} is less than index ${index}`);
      }
    }
    return elms[index];
  },

  /**
   * Check that element inside viewport
   * See: http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
   * @param {DOMElement} elem
   * @returns {boolean}
   */
  isElementInViewport(elem) {
    const rect = elem.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};
