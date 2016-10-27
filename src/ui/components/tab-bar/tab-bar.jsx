const {observer} = require('mobx-react');
const {Tabs, Tab, MDLComponent} = require('react-mdl');
const mobx = require('mobx');
const state = require('../../state');
const {TAB} = require('../../state/constants');
const TabBarItem = require('./tab-bar-item');

const tabList = [
  TAB.TESTS,
  TAB.REPORT,
  TAB.SETTINGS,
];

module.exports = observer(function TabBar() {
  // unfortunately mdl-tabs component works only with tab indexes, not ids
  const activeTabIndex = tabList.indexOf(state.selectedTab);
  // MDLComponent is needed because of: https://github.com/tleunen/react-mdl/issues/394
  // ripple effect also does not work
  return (
    <MDLComponent>
      <Tabs ripple activeTab={activeTabIndex}>
        <Tab onClick={() => selectTab(TAB.TESTS)}>
          <TabBarItem icon="code" text="Tests"/>
        </Tab>
        <Tab onClick={() => selectTab(TAB.REPORT)}>
          <TabBarItem icon="description" text="Report"/>
        </Tab>
        <Tab style={{marginLeft: 'auto'}} onClick={() => selectTab(TAB.SETTINGS)}>
          <TabBarItem icon="settings" text="Settings"/>
        </Tab>
      </Tabs>
    </MDLComponent>
  );
});

const selectTab = mobx.action(function (tabId) {
  state.selectedTab = tabId;
});
