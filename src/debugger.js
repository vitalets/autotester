/**
 * Debugger attached to particular target
 */

const thenChrome = require('then-chrome');
const logger = require('./logger').create('Debugger');

class Debugger {

  attach(target) {
    this._target = target;
    this._targetStr = JSON.stringify(target);
    return thenChrome.debugger.attach(this._target, '1.1')
      .then(() => logger.log(`Attached to ${this._targetStr}`));
  }

  sendCommand(name, params = {}) {
    logger.log(`Send command ${name}`, params);
    return thenChrome.debugger.sendCommand(this._target, name, params);
  }

  detach() {
    return thenChrome.debugger.detach(this._target)
      .then(() => logger.log(`Detached from ${this._targetStr}`));
  }

  getTarget() {
    return this._target;
  }

  isAttachedTo(target) {
    const sameTabId = this._target.tabId && this._target.tabId === target.tabId;
    const sameExtensionId = this._target.extensionId && this._target.extensionId === target.extensionId;
    return sameTabId || sameExtensionId;
  }
}

module.exports = Debugger;
