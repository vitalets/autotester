/**
 * Implementation of console interface
 */

const stringifySafe = require('json-stringify-safe');

const MAX_INLINE_OBJ_LENGTH = 50;

module.exports = class Console {
  constructor() {
    this._lines = [];
    this.onMessage = () => {};
    this.onClear = () => {};
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
    this._lines.length = 0;
    this.onClear();
  }

  _addLine(type, args) {
    args = args.map(formatArg);
    const line = {type, args};
    this._lines.push(line);
    this.onMessage(line);
  }
};

function formatArg(arg) {
  switch (typeof arg) {
    case 'object':
      // todo: date and regexp
      return arg === null ? formatNullUndefined() : formatString(stringifyObj(arg));
    case 'function':
      return formatString(arg.toString());
    case 'number':
      return formatNumber(arg);
    case 'undefined':
      return formatNullUndefined();
    default:
      return formatString(arg);
  }
}

function formatNullUndefined(v) {
  return {
    type: 'null-undefined',
    text: String(v),
  };
}

function formatString(v) {
  return {
    type: 'string',
    text: v,
  };
}

function formatNumber(v) {
  return {
    type: 'number',
    text: v,
  };
}

function stringifyObj(obj) {
  try {
    let str = stringifySafe(obj, replacer, 2);
    // for small objects use inline
    if (str.length < MAX_INLINE_OBJ_LENGTH) {
      str = stringifySafe(obj, replacer);
    }
    return str;
  } catch(e) {
    return obj.toString();
  }
}

/**
 * Replace Date and Regexp in stringify
 *
 * @param {String} key
 * @param {*} value
 */
function replacer(key, value) {
  if (value instanceof Date) {
    return value.toString();
  } else if (value instanceof RegExp) {
    return `/${value}/`;
  } else {
    return value;
  }
}
