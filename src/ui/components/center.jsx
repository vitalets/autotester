const {TAB} = require('../store/constants');
const TabContent = require('./tab-content');
const SourcesTab = require('./sources-tab');
const ReportTab = require('./report-tab');
const SettingsTab = require('./settings-tab');

module.exports = () => {
  return (
    <div className="flex-container">
      <TabContent id={TAB.SOURCES}>
        <SourcesTab/>
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


