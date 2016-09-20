/**
 * UI entry
 */

const ReactDOM = require('react-dom');
require('react-mdl/extra/material');
const App = require('./components/app');
const errors = require('./controllers/errors');
const smartUrlOpener = require('../utils/smart-url-opener');

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);

errors.init();
smartUrlOpener.listen();

require.ensure(['./controllers/app'], function(require) {
  require('./controllers/app').start();
}, '/core/ui/bundle');
