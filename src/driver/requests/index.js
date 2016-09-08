/**
 * Requests module for webdriver
 * Collects network requests
 */

const promise = require('selenium-webdriver/lib/promise');
const Collector = require('./collector');

const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;

class Requests extends Collector {

  constructor(driver) {
    super();
    this._driver = driver;
    this._flow = this._driver.controlFlow();
    this._listenFlowEvents();
  }

  collect() {
    return this._flow.execute(() => super.collect());
  }

  stop() {
    return this._flow.execute(() => super.stop());
  }

  /**
   * Returns catched requests passing filter
   *
   * @param {Object} filter
   */
  get(filter) {
    return this._flow.execute(() => super.get(filter));
  }

  getCount(filter) {
    return this.get(filter)
      .then(requests => requests.length);
  }

  /**
   * Convenient way to view collected requests:
   * driver.requests().dump(console);
   *
   * @param {Object} logging object with .log() method
   * @returns {!ManagedPromise.<*>}
   */
  dump(logging) {
    return this._flow.execute(() => super.dump(logging));
  }

  /**
   * Stop listening requests in case flow gets idle or throws exception
   */
  _listenFlowEvents() {
    this._flow.on(IDLE, () => super.stop());
    this._flow.on(UNCAUGHT_EXCEPTION, () => super.stop());
  }
}

module.exports = Requests;
