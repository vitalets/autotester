const {observer} = require('mobx-react');
const classNames = require('classnames');
const state = require('../state');

module.exports = observer(function TabContent(props) {
  const isActive = state.selectedTab === props.id;
  const className = classNames('tab-content', 'flex-container', {hidden: !isActive});
  return (
    <div className={className}>{props.children}</div>
  );
});
