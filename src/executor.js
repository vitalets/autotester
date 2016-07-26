/**
 * Execute selenium commands via chrome extensions api
 */

const seleniumCommand = require('selenium-webdriver/lib/command');

const TabLoader = require('./tab-loader');
const logger = require('./logger').create('Executor');

const commandModules = [
  require('./commands/session'),
  require('./commands/element-search'),
  require('./commands/navigation'),
  require('./commands/mouse'),
  require('./commands/keyboard'),
  require('./commands/window'),
  require('./commands/switch'),
];

class Executor extends seleniumCommand.Executor {
  constructor() {
    super();
    this._commands = new Map();
    this._registerCommands();
    TabLoader.init();
  }

  execute(cmd) {
    const name = cmd.getName();
    logger.log(`Selenium command '${name}':`, cmd.getParameters());
    if (this._commands.has(name)) {
      const params = cmd.getParameters();
      const fn = this._commands.get(name);
      return fn(params)
        .then(res => {
          logger.log(`Response to '${name}':`, res);
          return res;
        })
    } else {
      throw new Error(`Unknown command: ${name}`);
    }
  }

  _registerCommands() {
    commandModules.forEach(m => {
      if (!m.commands) {
        throw new Error(`Module '${m.name}' should export commands`);
      }
      Object.keys(m.commands).forEach(name => {
        if (this._commands.has(name)) {
          throw new Error(`Dublicate command ${name}`);
        }
        this._commands.set(name, m.commands[name]);
      });
    });
    const total = Object.keys(seleniumCommand.Name).length;
    logger.log(`Supported commands: ${this._commands.size} of ${total}`);
  }
}

module.exports = Executor;
