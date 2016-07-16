
const webdriver = require('selenium-webdriver/lib/webdriver');
const command = require('selenium-webdriver/lib/command');
const session = require('selenium-webdriver/lib/session');
const logging = require('selenium-webdriver/lib/logging');
const capabilities = require('selenium-webdriver/lib/capabilities');

const thenChrome = require('then-chrome');
const TabLoader = require('./core/background/tab-loader');
const tabLoader = new TabLoader();
/**
 * Creates a new WebDriver client for Chrome.
 */
class Driver extends webdriver.WebDriver {
  constructor() {
    /*

    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    prefs.setLevel(logging.Type.CLIENT, logging.Level.ALL);
    prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
    prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    prefs.setLevel(logging.Type.SERVER, logging.Level.ALL);


    logging.getLogger('').setLevel(logging.Level.FINER);
    logging.getLogger('').addHandler(entry => {
      if (entry.message.indexOf('enqueue') >= 0
        && entry.message.indexOf('<then>') == -1
        && entry.message.indexOf('<catch>') == -1) {
        console.log('[selenium]', entry.message);
      }
    });
    */

    const caps = capabilities.Capabilities.chrome();

    const executor = new Executor();
    const driver = webdriver.WebDriver.createSession(executor, caps);

    super(driver.getSession(), executor, driver.controlFlow());
  }
}

const data = {
  sessionId: null,
  tabId: null,
  target: null,
};

class Executor extends command.Executor {
  execute(cmd) {
    const name = cmd.getName();
    console.log('command', name, cmd);
    switch(name) {
      case command.Name.NEW_SESSION:

        // Seems chorme can not access to data: urls, so we cant use 'data:text/html,chromewebdata'
        return tabLoader.create({})
          .then(tab => {
            console.log('tab loaded', tab.id);
            data.tabId = tab.id;
            data.target = {tabId: tab.id};
            return thenChrome.debugger.attach(data.target, '1.1')
          })
          .then(() => {
            console.log('debugger attached');
            data.sessionId = '123';
            return new session.Session(data.sessionId, {});
          });
        break;
      case command.Name.GET:
        return tabLoader.update(data.tabId, {url: cmd.getParameter('url')});
        break;
      case command.Name.FIND_ELEMENT:
        const selector = cmd.getParameter('value');
        return thenChrome.debugger.sendCommand(data.target, 'DOM.getDocument', {})
          .then(res => {
            console.log('getDocument', res);
            return thenChrome.debugger.sendCommand(data.target, 'DOM.querySelector', {
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
        return thenChrome.debugger.detach(data.target)
          .then(() => thenChrome.tabs.remove(data.tabId))
          .then(() => console.log('tab closed'));
        break;
      default:
        throw new Error('Unknown command!');
    }
  }
}

// PUBLIC API

module.exports = Driver;
