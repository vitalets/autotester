
const {Tabs, Tab} = require('react-mdl');
const mobx = require('mobx');
const store = require('../store').store;
const TabBarItem = require('./tab-bar-item');
const {TAB} = require('../store/constants');

const tabs = [
  TAB.SOURCES,
  TAB.REPORT,
  TAB.SETTINGS,
];

module.exports = () => {
  // unfortunately mdl-tabs component works only with tab indexes, not ids
  const activeTabIndex = tabs.indexOf(store.selectedTab);
  return (
    <Tabs ripple activeTab={activeTabIndex} onChange={handleChange}>
      <Tab>
        <TabBarItem icon="code" text="Sources"/>
      </Tab>
      <Tab>
        <TabBarItem icon="description" text="Report"/>
      </Tab>
      <Tab style={{marginLeft: 'auto'}}>
        <TabBarItem icon="settings" text="Settings"/>
      </Tab>
    </Tabs>
  );
};

const handleChange = mobx.action(function (tabIndex) {
  store.selectedTab = tabs[tabIndex];
});
