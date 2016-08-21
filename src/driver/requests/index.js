/**
 * Requests module for webdriver
 * Collects network requests
 */

const promise = require('selenium-webdriver/lib/promise');
const Collector = require('./collector');
const logger = require('../../utils/logger').create('Requests');

// todo: see note in constructor
// const {IDLE, UNCAUGHT_EXCEPTION} = promise.ControlFlow.EventType;

class Requests extends Collector {

  constructor(driver) {
    super();
    this._driver = driver;
    this._flow = this._driver.controlFlow();
    // todo: stop collecting on flow exception
    // todo: currently I can't get it working
    // todo: as flow UNCAUGHT_EXCEPTION event does not come here
    // this._flow.on(UNCAUGHT_EXCEPTION, e => this._onFlowException(e));
  }

  catch() {
    throw new Error('.catch() was renamed to .collect()');
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

  dump(logging) {
    return this._flow.execute(() => super.dump(logging));
  }
}

module.exports = Requests;
