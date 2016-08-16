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
    this._addLine('log', args);
  }

  info() {
    const args = [].slice.call(arguments);
    this._addLine('info', args);
  }

  warn() {
    const args = [].slice.call(arguments);
    this._addLine('warn', args);
  }

  error() {
    const args = [].slice.call(arguments);
    this._addLine('error', args);
  }

  clear() {
    this._setVisible(false);
    this._el.innerHTML = '';
  }

  _addLine(type, args) {
    this._setVisible(true);
    const line = document.createElement('div');
    line.classList.add(type);
    line.textContent = stringifyArgs(args);
    this._el.appendChild(line);
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
