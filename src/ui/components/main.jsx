const {TAB} = require('../store/constants');
const TabContent = require('./tab-content');
const ContentSources = require('./content-sources');
const ContentReport = require('./content-report');
const ContentSettings = require('./content-settings');

module.exports = () => {
  return (
    <main className="mdl-layout__content">
      <TabContent id={TAB.SOURCES}>
        <ContentSources/>
      </TabContent>
      <TabContent id={TAB.REPORT}>
        <ContentReport/>
      </TabContent>
      <TabContent id={TAB.SETTINGS}>
        <ContentSettings/>
      </TabContent>
    </main>
  );
};


