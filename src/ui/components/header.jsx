const Dropdown = require('./dropdown');
const HeaderText = require('./header-text');
const PrimaryButton = require('./primary-button');

const tests = [
  {value: 0, text: 'All'},
  {value: 1, text: 'test1'},
  {value: 2, text: 'test2'},
];

const targets = [
  {value: 1, text: 'this chrome'},
  {value: 2, text: 'localhost grid'},
  {value: 3, text: 'sauce labs'},
];

module.exports = () => {
  return <header className="mdl-layout__header">
    <div className="mdl-layout__header-row">
      <HeaderText>Tests:</HeaderText>
      <Dropdown id="tests" value="0" items={tests}/>
      <PrimaryButton>Run</PrimaryButton>
      <div className="mdl-layout-spacer"></div>
      <HeaderText>Target:</HeaderText>
      <Dropdown id="targets" value="1" items={targets}/>
    </div>
  </header>
};
