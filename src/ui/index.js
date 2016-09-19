/**
 * UI entry
 */

const ReactDOM = require('react-dom');
//require('material-design-lite/material');
require('react-mdl/extra/material');
require('getmdl-select/getmdl-select.min');
const App = require('./components/app');
const errors = require('./controllers/errors');
const smartUrlOpener = require('../utils/smart-url-opener');

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);

errors.init();
smartUrlOpener.listen();

require.ensure(['./controllers/main'], function(require) {
  const MainController = require('./controllers/main');
  new MainController().run();
}, '/core/ui/controllers');
