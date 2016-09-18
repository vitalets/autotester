
const TabTitle = require('./tab-title');
const {TAB} = require('../store/constants');

module.exports = () => {
    return <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
        <div className="mdl-tabs__tab-bar" style={{justifyContent: 'flex-start'}}>
            <TabTitle id={TAB.SOURCES} icon="code" text="Sources"/>
            <TabTitle id={TAB.REPORT} icon="description" text="Report"/>
            <TabTitle id={TAB.SETTINGS} icon="settings" text="Settings" style={{marginLeft: 'auto'}}/>
        </div>
        <div className="mdl-tabs__panel" id={TAB.SOURCES}></div>
        <div className="mdl-tabs__panel" id={TAB.REPORT}></div>
        <div className="mdl-tabs__panel" id={TAB.SETTINGS}></div>
    </div>

};
