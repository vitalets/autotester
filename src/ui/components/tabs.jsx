
const TabTitle = require('./tab-title');

module.exports = () => {
    return <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
        <div className="mdl-tabs__tab-bar" style={{justifyContent: 'flex-start'}}>
            <TabTitle id="sources" icon="code" text="Sources"/>
            <TabTitle id="report" icon="description" text="Report"/>
            <TabTitle id="settings" icon="settings" text="Settings" style={{marginLeft: 'auto'}}/>
        </div>
        <div className="mdl-tabs__panel" id="sources"></div>
        <div className="mdl-tabs__panel" id="report"></div>
        <div className="mdl-tabs__panel" id="settings"></div>
    </div>

};
