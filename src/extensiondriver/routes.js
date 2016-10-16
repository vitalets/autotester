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
const requests = require('./commands/requests');

// lodash added for equal length to visually indent
const GET_ = 'get';
const POST = 'post';
const PUT_ = 'put';
const DEL_ = 'delete';

module.exports = [
  [POST, '/session', session.newSession],
  [DEL_, '/session/:sessionId', session.deleteSession],
  [POST, '/session/:sessionId/url', navigation.go],
  [GET_, '/session/:sessionId/url', navigation.getCurrentUrl],
  [GET_, '/session/:sessionId/title', navigation.getTitle],

  [POST, '/session/:sessionId/element', elementSearch.findElement],
  [POST, '/session/:sessionId/elements', elementSearch.findElements],
  [POST, '/session/:sessionId/element/:id/value', keyboard.sendKeysToElement],
  [GET_, '/session/:sessionId/element/:id/name', element.getElementTagName],
  [GET_, '/session/:sessionId/element/:id/text', element.getElementText],
  [POST, '/session/:sessionId/element/:id/click', mouse.clickElement],
  [POST, '/session/:sessionId/element/:id/submit', element.submit],
  [POST, '/session/:sessionId/element/:id/element', elementSearch.findChildElement],
  [POST, '/session/:sessionId/element/:id/elements', elementSearch.findChildElements],

  [POST, '/session/:sessionId/execute', evaluate.execute],
  [POST, '/session/:sessionId/execute_async', evaluate.executeAsync],
  [POST, '/session/:sessionId/timeouts', timeouts.setTimeout],

  [DEL_, '/session/:sessionId/window', windowCommand.close],
  [POST, '/session/:sessionId/window', switchTo.window],
  [GET_, '/session/:sessionId/window_handle', windowCommand.getCurrentWindowHandle],
  [GET_, '/session/:sessionId/window_handles', windowCommand.getAllWindowHandles],

  // extra autotester routes: live over `autotester` vendor prefix
  [POST, '/session/:sessionId/autotester/newtab', switchTo.newTab],
  [POST, '/session/:sessionId/autotester/extension', switchTo.extension],

  [PUT_, '/session/:session/autotester/requests', requests.collect],
  [DEL_, '/session/:session/autotester/requests', requests.stop],
  [POST, '/session/:session/autotester/requests', requests.get],
];
