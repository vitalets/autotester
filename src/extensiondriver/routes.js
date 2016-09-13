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
  router.del('/session/:sessionId', session.deleteSession);
  router.post('/session/:sessionId/url', navigation.go);
  router.get('/session/:sessionId/url', navigation.getCurrentUrl);
  router.get('/session/:sessionId/title', navigation.getTitle);

  router.post('/session/:sessionId/element', elementSearch.findElement);
  router.post('/session/:sessionId/element/:id/value', keyboard.sendKeysToElement);
  router.get('/session/:sessionId/element/:id/name', element.getElementTagName);
  router.get('/session/:sessionId/element/:id/text', element.getElementText);
  router.post('/session/:sessionId/element/:id/click', mouse.clickElement);
  router.post('/session/:sessionId/element/:id/submit', element.submit);
  router.post('/session/:sessionId/element/:id/element', elementSearch.findChildElement);

  router.post('/session/:sessionId/execute', evaluate.execute);
  router.post('/session/:sessionId/execute_async', evaluate.executeAsync);
  router.post('/session/:sessionId/timeouts', timeouts.setTimeout);

  router.del('/session/:sessionId/window', windowCommand.close);
  router.post('/session/:sessionId/window', switchTo.window);
  router.get('/session/:sessionId/window_handle', windowCommand.getCurrentWindowHandle);
  router.get('/session/:sessionId/window_handles', windowCommand.getAllWindowHandles);

  // extra autotester routes
  router.post('/session/:sessionId/newtab', switchTo.newTab);
  router.post('/session/:sessionId/extension', switchTo.extension);
  //
  // router.post('/session/:session/requests', switchTo.extension);
  // router.del('/session/:session/requests', switchTo.extension);
  // router.get('/session/:session/requests', switchTo.extension);
};

