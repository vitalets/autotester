const {observer} = require('mobx-react');
const uiStore = require('../stores/ui').store;

module.exports = observer(function ContentReport() {
  return (
    <div>
      <pre id="console" className="console"></pre>
      <pre id="report" className="report"></pre>
      <div id="mocha" className="report"></div>
    </div>
  );
});
