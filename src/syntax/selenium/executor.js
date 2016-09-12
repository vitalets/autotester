/**
 * Execute selenium commands via chrome extensions api
 */

const seleniumCommand = require('selenium-webdriver/lib/command');
const commands = require('./commands');
const logger = require('../utils/logger').create('Executor');

class Executor extends seleniumCommand.Executor {
  /**
   * Executes selenium command
   * @param {Command} cmd
   * @returns {Promise}
   */
  execute(cmd) {
    const name = cmd.getName();
    const params = cmd.getParameters();
    if (!name) {
      throw new Error('Empty selenium command');
    }
    logger.log(`Selenium command '${name}':`, params);
    if (commands.hasOwnProperty(name)) {
      return commands[name](params)
        .then(res => {
          logger.log(`Response to '${name}':`, res);
          return res;
        });
    } else {
      throw new Error(`Unknown command: ${name}`);
    }
  }
}

module.exports = Executor;
