
const ReportStatus = require('../report/status');
const HtmlConsole = require('../html-console');

module.exports = function Report() {
  return (
    <div className="report-tab">
      <ReportStatus/>
      <HtmlConsole/>
      {/*<pre id="report" className="report"></pre>*/}
      <div id="mocha" className="report"></div>
    </div>
  );
};
