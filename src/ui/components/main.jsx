const {TABS} = require('../store/constants');
const TabContent = require('./tab-content');
const ContentSources = require('./content-sources');
const ContentReport = require('./content-report');
const ContentSettings = require('./content-settings');

module.exports = () => {
  return (
    <main className="mdl-layout__content">
      <TabContent id={TABS.SOURCES}>
        <ContentSources/>
      </TabContent>
      <TabContent id={TABS.REPORT}>
        <ContentReport/>
      </TabContent>
      <TabContent id={TABS.SETTINGS}>
        <ContentSettings/>
      </TabContent>
    </main>
  );
};


