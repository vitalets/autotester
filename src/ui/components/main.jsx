
const ContentSources = require('./content-sources');
const ContentReport = require('./content-report');
const ContentSettings = require('./content-settings');

module.exports = () => {
  return <main className="mdl-layout__content">
      <ContentSources/>
      <ContentReport/>
      <ContentSettings/>
  </main>
};


