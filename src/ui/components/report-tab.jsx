
const ReportStatus = require('./report-status');
const HtmlConsole = require('./html-console');

module.exports = function ReportTab() {
  return (
    <div className="report-tab">
      <ReportStatus/>
      <HtmlConsole/>
      {/*<pre id="report" className="report"></pre>*/}
      <div id="mocha" className="report"></div>
    </div>
  );
};
