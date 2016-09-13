
const commands = require('./commands');

module.exports = class Collector {

  constructor(driver) {
    this._driver = driver;
    this._listenFlowEvents();
  }

  collect() {
    const cmd = new command.Command(commands.REQUESTS_COLLECT);
    return this.driver_.schedule(cmd, 'WebDriver.requests().collect()');
  }

  stop() {
    const cmd = new command.Command(commands.REQUESTS_STOP);
    return this.driver_.schedule(cmd, 'WebDriver.requests().stop()');
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
};
