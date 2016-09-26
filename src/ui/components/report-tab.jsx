
const ReportStatus = require('./report-status');

module.exports = function ReportTab() {
  return (
    <div>
      <ReportStatus/>
      {/*<pre id="console" className="console"></pre>*/}
      {/*<pre id="report" className="report"></pre>*/}
      <div id="mocha" className="report"></div>
    </div>
  );
};
