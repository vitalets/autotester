/**
 * Background entry point
 */

const browserAction = require('./browser-action');
const App = require('./app');

browserAction.setup();
new App().run();
