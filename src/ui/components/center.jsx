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

      {/*<ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect"*/}
          {/*htmlFor="demo-menu-lower-right">*/}
        {/*<li className="mdl-menu__item">Some Action</li>*/}
        {/*<li className="mdl-menu__item">Another Action</li>*/}
        {/*<li disabled className="mdl-menu__item">Disabled Action</li>*/}
        {/*<li className="mdl-menu__item">Yet Another Action</li>*/}
      {/*</ul>*/}

    </main>
  );
};


