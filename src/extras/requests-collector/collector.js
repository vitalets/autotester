
const command = require('selenium-webdriver/lib/command');
const commands = require('./commands');

module.exports = class Collector {

  constructor(driver) {
    this._driver = driver;
    this._flow = this._driver.controlFlow();
    // todo: think about it: if
    // this._listenFlowEvents();
  }

  collect() {
    const cmd = new command.Command(commands.REQUESTS_COLLECT);
    return this._driver.schedule(cmd, 'WebDriver.requests().collect()');
  }

  stop() {
    const cmd = new command.Command(commands.REQUESTS_STOP);
    return this._driver.schedule(cmd, 'WebDriver.requests().stop()');
  }

  /**
   * Returns catched requests passing filter
   *
   * @param {Object} filter
   */
  get(filter) {
    const cmd = new command.Command(commands.REQUESTS_GET).setParameter('filter', filter);
    return this._driver.schedule(cmd, 'WebDriver.requests().get()');
  }

  getCount(filter) {
    return this.get(filter)
      .then(requests => requests.length);
  }

  /**
   * Convenient way to view collected requests:
   * driver.requests().dump(console);
   *
   * @param {Object} [logging] object with .log() method. Optional because we may need result as string to log ourself
   * @returns {!ManagedPromise.<*>}
   */
  dump(logging) {
    return this.get().then(requests => {
      const result = requests.map(r => `${r.type}: ${r.method} ${r.url}`);
      result.unshift(`Collected ${requests.length} request(s):`);
      const resultStr = result.join('\n');
      if (logging && logging.log) {
        logging.log(resultStr);
      }
      return resultStr;
    });
  }

  /**
   * Stop listening requests in case flow gets idle or throws exception
   */
  // _listenFlowEvents() {
  //   this._flow.on(IDLE, () => super.stop());
  //   this._flow.on(UNCAUGHT_EXCEPTION, () => super.stop());
  // }
};
