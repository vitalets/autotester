const TabContent = require('./tab-content');
const ContentSources = require('./content-sources');
const ContentReport = require('./content-report');
const ContentSettings = require('./content-settings');

module.exports = () => {
  return (
    <main className="mdl-layout__content">
      <TabContent id="sources">
        <ContentSources/>
      </TabContent>
      <TabContent id="report">
        <ContentReport/>
      </TabContent>
      <TabContent id="settings">
        <ContentSettings/>
      </TabContent>
    </main>
  );
};


