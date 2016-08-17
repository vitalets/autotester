/**
 * Html element that displays messages like console
 */

const marked = require('marked');

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
    const str = stringifyArgs(args);
    const html = marked(str, {sanitize: true}).trim();
    const lineElem = document.createElement('div');
    lineElem.classList.add(type);
    lineElem.innerHTML = html;
    this._el.appendChild(lineElem);
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
  switch (typeof arg) {
    case 'object':
      return JSON.stringify(arg);
    case 'number':
      return `**${arg}**`;
    case 'undefined':
      return `*${arg}*`;
    default:
      return String(arg);
  }
}

module.exports = HtmlConsole;
