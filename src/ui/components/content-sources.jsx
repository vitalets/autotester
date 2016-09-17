
const {observer} = require('mobx-react');
const uiStore = require('../stores/ui').store;

module.exports = observer(function ContentSources() {
  const className = classNames({hidden: uiStore.activeTabId !== 'sources'});
  return <div className={className}>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
    sources<br/>
  </div>
});
