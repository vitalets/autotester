const {observer} = require('mobx-react');
const mobx = require('mobx');
const {Header, HeaderRow} = require('react-mdl');
const Dropdown = require('./dropdown');
const TopText = require('./top-text');
const TopButtonRun = require('./top-button-run');
const store = require('../store').store;

module.exports = observer(function Top() {
  return (
    <Header>
      <HeaderRow>
        <TopText>Tests:</TopText>
        <Dropdown id="tests" value={store.selectedTest} items={store.tests}
                  onChange={handleTestChange}/>
        <TopButtonRun/>
        <div className="mdl-layout-spacer"></div>
        <TopText>Target:</TopText>
        <Dropdown id="targets" value={store.selectedTarget} items={store.targets} align="right"
                  onChange={handleTargetChange}/>
      </HeaderRow>
    </Header>
  );
});

const handleTestChange = mobx.action(function(test) {
  store.selectedTest = test.value;
});

const handleTargetChange = mobx.action(function(target) {
  store.selectedTarget = target.value;
});
