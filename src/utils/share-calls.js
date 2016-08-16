/**
 * On any method call of `original` look up for same method in secondary
 * and if it exists share call
 */

module.exports = function (original, secondary) {
  return new Proxy(original, {
    get: (target, prop) => {
      return typeof secondary[prop] === 'function'
        ? getMethodProxy(target, prop, secondary)
        : target[prop];
    }
  });
};

function getMethodProxy(target, prop, secondary) {
  return new Proxy(target[prop], {
    apply(fn, thisArg, argumentsList) {
      try {
        secondary[prop].apply(secondary, argumentsList);
      } catch (e) {
        console.error(e);
      }
      return fn.apply(target, argumentsList);
    }
  });
}
