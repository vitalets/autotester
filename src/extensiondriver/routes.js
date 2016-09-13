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
  router.del( '/session/:session', session.deleteSession);
  router.post('/session/:session/url', navigation.go);
  router.get( '/session/:session/url', navigation.getCurrentUrl);
  router.get( '/session/:session/title', navigation.getTitle);

  router.post( '/session/:session/element', elementSearch.findElement);
  router.post( '/session/:session/element/:id/value', keyboard.sendKeysToElement);
  router.get(  '/session/:session/element/:id/name', element.getElementTagName);

  // extra autotester routes
  router.post('/session/:session/newtab', switchTo.newTab);
  router.post('/session/:session/extension', switchTo.extension);
};

