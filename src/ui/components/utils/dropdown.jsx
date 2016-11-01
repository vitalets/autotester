/**
 * Implementation of MDL dropdown
 */
const {Menu, MenuItem} = require('react-mdl');

module.exports = class Dropdown extends React.Component {
  handleClick(item) {
    if (this.props.value !== item.value && this.props.onChange) {
      this.props.onChange(item);
    }
  }
  render() {
    // generate unique key on every render to re-mount whole menu component.
    // otherwise meniitems are broken after re-render
    // see: https://github.com/tleunen/react-mdl/issues/400
    // also, we cant use ripple effect on menu as we get error in mdl js :(
    const key = Date.now() + Math.random();
    const props = this.props;
    const internalId = `dropdown-${props.id}`;
    const items = props.items || [];
    const selectedItem = items.filter(item => item.value === props.value)[0];
    const shownText = selectedItem && selectedItem.text || '';

    return (
      <div className="dropdown" id={props.id} key={key}>
        <span className="dropdown__field" id={internalId}>
          <span className="dropdown__value">{shownText}</span>
          <i className="material-icons">expand_more</i>
        </span>

        <Menu target={internalId} align={props.align || 'left'}>
          {items.map(item => {
            return <MenuItem key={item.value} onClick={() => this.handleClick(item)}>{item.text}</MenuItem>
          })}
        </Menu>
      </div>
    );
  }
};
