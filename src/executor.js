/**
 * Execute selenium commands via chrome extensions api
 */

const seleniumCommand = require('selenium-webdriver/lib/command');

const TargetManager = require('./target-manager');
const Command = require('./commands/command');
const TabLoader = require('./tab-loader');
const logger = require('./logger').create('Executor');

const commandModules = [
  require('./commands/session'),
  // require('./commands/element-actions'),
  require('./commands/navigation'),
];

class Executor extends seleniumCommand.Executor {
  constructor() {
    super();
    this._commands = new Map();
    this._registerCommands();
    Command.targetManager = new TargetManager();
    TabLoader.init();
  }

  execute(cmd) {
    const name = cmd.getName();
    logger.log('selenium command:', name, cmd);
    if (this._commands.has(name)) {
      const params = cmd.getParameters();
      const fn = this._commands.get(name);
      return fn(params);
    } else {
      throw new Error(`Unknown command: ${name}`);
    }
  }

  _registerCommands() {
    commandModules.forEach(m => {
      const commands = m.exports();
      if (!commands) {
        throw new Error(`Module ${m.name} should return commands from exports()`);
      }
      Object.keys(commands).forEach(name => {
        this._commands.set(name, commands[name].bind(m));
      });
    });
  }
}

module.exports = Executor;
