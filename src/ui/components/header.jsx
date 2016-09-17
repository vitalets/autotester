const Dropdown = require('./dropdown');
const HeaderTitle = require('./header-title');
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
            <HeaderTitle text="Tests:"/>
            <Dropdown id="tests" value="0" items={tests}/>
            <PrimaryButton>Run</PrimaryButton>
            <div className="mdl-layout-spacer"></div>
            <HeaderTitle text="Target:"/>
            <Dropdown id="targets" value="1" items={targets}/>
        </div>
    </header>
};
