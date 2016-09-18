
const TabTitle = require('./tab-title');
const {TABS} = require('../store/constants');

module.exports = () => {
    return <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
        <div className="mdl-tabs__tab-bar" style={{justifyContent: 'flex-start'}}>
            <TabTitle id={TABS.SOURCES} icon="code" text="Sources"/>
            <TabTitle id={TABS.REPORT} icon="description" text="Report"/>
            <TabTitle id={TABS.SETTINGS} icon="settings" text="Settings" style={{marginLeft: 'auto'}}/>
        </div>
        <div className="mdl-tabs__panel" id={TABS.SOURCES}></div>
        <div className="mdl-tabs__panel" id={TABS.REPORT}></div>
        <div className="mdl-tabs__panel" id={TABS.SETTINGS}></div>
    </div>

};
