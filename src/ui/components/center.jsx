const {TAB} = require('../state/constants');
const TabContent = require('./tab-content');
const TestsTab = require('./tests-tab');
const ReportTab = require('./report-tab');
const SettingsTab = require('./settings-tab');

module.exports = function Center() {
  return (
    <div className="flex-container">
      <TabContent id={TAB.TESTS}>
        <TestsTab/>
      </TabContent>
      <TabContent id={TAB.REPORT}>
        <ReportTab/>
      </TabContent>
      <TabContent id={TAB.SETTINGS}>
        <SettingsTab/>
      </TabContent>
    </div>
  );
};
