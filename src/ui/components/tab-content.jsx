const {observer} = require('mobx-react');
const classNames = require('classnames');
const store = require('../store').store;

module.exports = observer(function TabContent(props) {
  const isActive = store.selectedTab === props.id;
  const className = classNames('tab-content', 'flex-container', {hidden: !isActive});
  return (
    <div className={className}>{props.children}</div>
  );
});
