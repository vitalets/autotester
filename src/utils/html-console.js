/**
 * Html element that displays messages like console
 */

const marked = require('marked');
const stringifySafe = require('json-stringify-safe');

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
      return arg === null
        ? '*null*'
        : stringifyObj(arg);
    case 'function':
      return arg.toString();
    case 'number':
      return `**${arg}**`;
    case 'undefined':
      return `*${arg}*`;
    default:
      return String(arg);
  }
}

function stringifyObj(obj) {
  try {
    let str = stringifySafe(obj, replacer, 2);
    // for small objects use inline
    if (str.length < 50) {
      str = stringifySafe(obj, replacer);
    }
    return str;
  } catch(e) {
    return obj.toString();
  }
}

function replacer(key, value) {
  if (value instanceof Date) {
    return value.toString();
  } else if (value instanceof RegExp) {
    return `/${value}/`;
  } else if (value === undefined) {
    return '*undefined*';
  } else {
    return value;
  }
}

module.exports = HtmlConsole;
