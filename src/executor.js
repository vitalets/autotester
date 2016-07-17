/**
 * Execute selenium commands via chrome extenisons api
 */

const command = require('selenium-webdriver/lib/command');
const session = require('selenium-webdriver/lib/session');
const thenChrome = require('then-chrome');

const TabLoader = require('./core/background/tab-loader');
const Debugger = require('./debugger');

const tabLoader = new TabLoader();

class Executor extends command.Executor {
  constructor() {
    super();
    this._debuggers = [];
    this._currentTabId = null;
    this._currentDebugger = null;
    this._currentRootId = null;
  }

  startSession() {
    return tabLoader.create({})
      .then(tab => this.switchToTab(tab.id))
      // session id is constant as we have only one instance of chrome
      .then(() => new session.Session('autotester-session', {}));
  }

  stopSession() {
    const tasks = this._debuggers.map(d => {
      return d.detach()
        .then(() => d.getTarget().tabId ? thenChrome.tabs.remove(d.getTarget().tabId) : null);
    });
    return Promise.all(tasks);
  }

  /**
   * Native selenium does not support tabs but Autotester does!
   * see: https://github.com/SeleniumHQ/selenium/issues/2247
   * see: https://github.com/SeleniumHQ/selenium/issues/399
   * @param tabId
   * @returns {Promise.<T>}
     */
  switchToTab(tabId) {
    this._currentTabId = tabId;
    this._currentRootId = null;
    return thenChrome.tabs.update(tabId, {active: true})
      .then(() => this._attachDebugger({tabId}));
  }

  switchToWindow(windowId) {
    // todo
  }

  switchToFrame(frameId) {
    // todo
  }

  switchToExtension(extensionId) {
    // todo
  }

  _attachDebugger(target) {
    const existingDebugger = this._debuggers.filter(d => d.isAttachedTo(target))[0];
    if (existingDebugger) {
      this._currentDebugger = existingDebugger;
      return Promise.resolve();
    } else {
      this._currentDebugger = new Debugger();
      this._debuggers.push(this._currentDebugger);
      return this._currentDebugger.attach(target);
    }
  }

  execute(cmd) {
    const name = cmd.getName();
    console.log('selenium command', name, cmd);
    switch(name) {
      case command.Name.NEW_SESSION:
        return this.startSession();
        break;
      case command.Name.GET:
        return tabLoader.update(this._currentTabId, {url: cmd.getParameter('url')});
        break;
      case command.Name.FIND_ELEMENT:
        const selector = cmd.getParameter('value');
        return this._debugger.sendCommand('DOM.getDocument', {})
          .then(res => {
            console.log('getDocument', res);
            return this._debugger.sendCommand('DOM.querySelector', {
              nodeId: res.root.nodeId,
              selector: selector
            });
          })
          .then(node => {
            console.log('querySelector', node);
            if (!node.nodeId) {
              return Promise.reject(`Element not found by ${selector}`);
            }
            return webdriver.WebElement.buildId(String(node.nodeId));
          });
        break;
      case command.Name.SEND_KEYS_TO_ELEMENT:
        // todo: scroll
        // todo: rawKeyPress
        return thenChrome.debugger.sendCommand(data.target, 'DOM.focus', {
            nodeId: Number(cmd.getParameter('id'))
          })
          .then(() => {
            return thenChrome.debugger.sendCommand(data.target, 'Input.dispatchKeyEvent', {
              "modifiers": 0,
              "nativeVirtualKeyCode": 0,
              "text": "w",
              "type": "char",
              "unmodifiedText": "w",
              "windowsVirtualKeyCode": 0
            });
          })
          .then(() => {
            return thenChrome.debugger.sendCommand(data.target, 'Input.dispatchKeyEvent', {
              "modifiers": 0,
              "nativeVirtualKeyCode": 0,
              "text": "e",
              "type": "char",
              "unmodifiedText": "e",
              "windowsVirtualKeyCode": 0
            });
          })
        break;
      case command.Name.CLICK_ELEMENT:
        return thenChrome.debugger.sendCommand(data.target, 'DOM.getBoxModel', {
            nodeId: Number(cmd.getParameter('id'))
          })
          .then(res => {
            const content = res.model.content;
            const centerX = content[0] + Math.round((content[2] - content[0]) / 2);
            const centerY = content[3] + Math.round((content[5] - content[3]) / 2);
            // todo: mousemove
            return thenChrome.debugger.sendCommand(data.target, 'Input.dispatchMouseEvent', {
                "button": "left",
                "clickCount": 1,
                "modifiers": 0,
                "type": "mousePressed",
                "x": centerX,
                "y": centerY
              })
              .then(() => thenChrome.debugger.sendCommand(data.target, 'Input.dispatchMouseEvent', {
                "button": "left",
                "clickCount": 1,
                "modifiers": 0,
                "type": "mouseReleased",
                "x": centerX,
                "y": centerY
              }));
          })

        break;
      case command.Name.GET_TITLE:
        return thenChrome.tabs.get(data.tabId)
          .then(tab => {
            // console.log('title is', tab.title);
            return tab.title;
          });
        break;
      case command.Name.QUIT:
        return this.stopSession();
        break;
      default:
        throw new Error('Unknown command!');
    }
  }
}

module.exports = Executor;
