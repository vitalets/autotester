/**
 * Map of available routes (endpoints) to commands
 *
 * See: https://w3c.github.io/webdriver/webdriver-spec.html#list-of-endpoints
 */

const session = require('./commands/session');
const switchTo = require('./commands/switch-to');
const windowCommand = require('./commands/window');
const navigation = require('./commands/navigation');
const mouse = require('./commands/mouse');
const keyboard = require('./commands/keyboard');
const elementSearch = require('./commands/element-search');
const element = require('./commands/element');
const evaluate = require('./commands/evaluate');
const timeouts = require('./commands/timeouts');

exports.initRouter = function (router) {
  router.post('/session', session.newSession);
  router.del('/session/:session', session.deleteSession);
  router.post('/session/:session/url', navigation.go);
  router.get('/session/:session/url', navigation.getCurrentUrl);
  router.get('/session/:session/title', navigation.getTitle);

  router.post('/session/:session/element', elementSearch.findElement);
  router.post('/session/:session/element/:id/value', keyboard.sendKeysToElement);
  router.get('/session/:session/element/:id/name', element.getElementTagName);
  router.get('/session/:session/element/:id/text', element.getElementText);
  router.post('/session/:session/element/:id/click', mouse.clickElement);
  router.post('/session/:session/element/:id/submit', element.submit);
  router.post('/session/:session/element/:id/element', elementSearch.findChildElement);

  router.post('/session/:session/execute', evaluate.execute);
  router.post('/session/:session/execute_async', evaluate.executeAsync);
  router.post('/session/:session/timeouts', timeouts.setTimeout);

  router.del('/session/:session/window', windowCommand.close);
  router.post('/session/:session/window', switchTo.window);
  router.get('/session/:session/window_handle', windowCommand.getCurrentWindowHandle);

  // extra autotester routes
  router.post('/session/:session/newtab', switchTo.newTab);
  router.post('/session/:session/extension', switchTo.extension);
};

