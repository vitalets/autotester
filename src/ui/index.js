/**
 * UI entry
 */

const ReactDOM = require('react-dom');
require('material-design-lite/material');
require('getmdl-select/getmdl-select.min');
const Layout = require('./components/layout');
const errors = require('./app/errors');
const smartUrlOpener = require('../utils/smart-url-opener');

ReactDOM.render(
  <Layout/>,
  document.getElementById('app')
);

errors.init();
smartUrlOpener.listen();

require.ensure(['./app'], function(require) {
  const App = require('./app');
  App.run();
}, '/core/ui/app');
