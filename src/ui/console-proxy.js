/**
 * Proxy console calls to DIV element
 */

class ConsoleProxy {
  constructor(selector, console) {
    this._el = document.querySelector(selector);
    this._setVisible(false);
    return new Proxy(console, {
      get: (target, prop) => {
        return this[prop]
          ? this._getMethodProxy(target, prop)
          : target[prop];
      }
    });
  }

  log(str) {
    this._addLine(str);
  }

  info(str) {
    // todo: use colors
    this._addLine(str);
  }

  warn(str) {
    this._addLine(str);
  }

  error(str) {
    this._addLine(str);
  }

  clear() {
    this._setVisible(false);
    this._el.textContent = '';
  }

  _addLine(str) {
    this._setVisible(true);
    this._el.textContent += str + '\n';
  }

  _setVisible(value) {
    const isVisible = this._el.style.display !== 'none';
    if (value !== isVisible) {
      this._el.style.display = value ? 'block' : 'none';
    }
  }

  _getMethodProxy(target, prop) {
    const self = this;
    return new Proxy(target[prop], {
      apply(fn, thisArg, argumentsList) {
        try {
          const str = stringifyArgs(argumentsList);
          self[prop](str);
        } catch (e) {
          console.error(e);
        }
        return fn.apply(target, argumentsList);
      }
    });
  }
}

function stringifyArgs(args) {
  return args.map(stringifyArg).join(' ');
}

function stringifyArg(arg) {
  return typeof arg === 'object'
    ? JSON.stringify(arg)
    : String(arg);
}

module.exports = ConsoleProxy;
