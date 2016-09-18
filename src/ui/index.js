/**
 * UI entry
 */

const ReactDOM = require('react-dom');
require('material-design-lite/material');
require('getmdl-select/getmdl-select.min');
const Layout = require('./components/layout');
const errors = require('./controllers/errors');
const smartUrlOpener = require('../utils/smart-url-opener');

ReactDOM.render(
  <Layout/>,
  document.getElementById('app')
);

errors.init();
smartUrlOpener.listen();

require.ensure(['./controllers/main'], function(require) {
  const MainController = require('./controllers/main');
  new MainController().run();
}, '/core/ui/controllers');
