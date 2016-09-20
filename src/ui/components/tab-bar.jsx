const {observer} = require('mobx-react');
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

module.exports = observer(function TabBar() {
  // unfortunately mdl-tabs component works only with tab indexes, not ids
  const activeTabIndex = tabs.indexOf(store.selectedTab);
  return (
    <Tabs ripple activeTab={activeTabIndex}>
      <Tab onClick={() => selectTab(TAB.SOURCES)}>
        <TabBarItem icon="code" text="Sources"/>
      </Tab>
      <Tab onClick={() => selectTab(TAB.REPORT)}>
        <TabBarItem icon="description" text="Report"/>
      </Tab>
      <Tab style={{marginLeft: 'auto'}} onClick={() => selectTab(TAB.SETTINGS)}>
        <TabBarItem icon="settings" text="Settings"/>
      </Tab>
    </Tabs>
  );
});

const selectTab = mobx.action(function (tabId) {
  store.selectedTab = tabId;
});
