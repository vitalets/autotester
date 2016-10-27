const {observer} = require('mobx-react');
const state = require('../../state');
const {TAB} = require('../../state/constants');
const Files = require('./files');
const Report = require('./report');
const Settings = require('./settings');

const tabs = {
  [TAB.TESTS]: Files,
  [TAB.REPORT]: Report,
  [TAB.SETTINGS]: Settings,
};

module.exports = observer(function Tabs() {
  const ActiveComponent = tabs[state.selectedTab];
  return (
    <div className="flex-container tab-content">
      {ActiveComponent ? <ActiveComponent/> : <div></div>}
    </div>
  );
});
