/**
 * Html element that displays messages like console
 */

class HtmlConsole {
  constructor(selector) {
    this._el = document.querySelector(selector);
    this._setVisible(false);
  }

  log() {
    const args = [].slice.call(arguments);
    this._addLine(args);
  }

  info() {
    const args = [].slice.call(arguments);
    this._addLine(args);
  }

  warn() {
    const args = [].slice.call(arguments);
    this._addLine(args);
  }

  error() {
    const args = [].slice.call(arguments);
    this._addLine(args);
  }

  clear() {
    this._setVisible(false);
    this._el.textContent = '';
  }

  _addLine(args) {
    const str = stringifyArgs(args);
    this._setVisible(true);
    this._el.textContent += str + '\n';
  }

  _setVisible(value) {
    const isVisible = this._el.style.display !== 'none';
    if (value !== isVisible) {
      this._el.style.display = value ? 'block' : 'none';
    }
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

module.exports = HtmlConsole;
