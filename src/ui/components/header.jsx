const {observer} = require('mobx-react');
const Dropdown = require('./dropdown');
const HeaderText = require('./header-text');
const PrimaryButton = require('./primary-button');
const store = require('../store').store;

module.exports = observer(function Header() {
  return <header className="mdl-layout__header">
    <div className="mdl-layout__header-row">
      <HeaderText>Tests:</HeaderText>
      <Dropdown id="tests" value={store.selectedTest} items={store.tests}/>
      <PrimaryButton>Run</PrimaryButton>
      <div className="mdl-layout-spacer"></div>
      <HeaderText>Target:</HeaderText>
      <Dropdown id="targets" value={store.selectedTarget} items={store.targets}/>
    </div>
  </header>
});
