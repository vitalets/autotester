/**
 * Simple console logger
 */

class Logger {
  constructor(prefix) {
    this._prefix = `[${prefix}]:`;
  }

  log() {
    this._callConsole('log', [].slice.call(arguments));
  }

  info() {
    this._callConsole('info', [].slice.call(arguments));
  }

  warn() {
    this._callConsole('warn', [].slice.call(arguments));
  }

  error() {
    this._callConsole('error', [].slice.call(arguments));
  }

  _callConsole(method, args) {
    console[method].apply(console, [this._prefix].concat(args));
  }
}

/**
 * Helper to create logger right after require()
 * E.g. const logger = require('./logger').create('Module')
 *
 * @param {String} prefix
 * @returns {Logger}
 */
Logger.create = function (prefix) {
  return new Logger(prefix);
};

module.exports = Logger;
