const {observer} = require('mobx-react');

module.exports = observer(function ReportTab() {
  return (
    <div>
      <pre id="console" className="console"></pre>
      <pre id="report" className="report"></pre>
      <div id="mocha" className="report"></div>
    </div>
  );
});
