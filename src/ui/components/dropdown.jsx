
module.exports = props => {
  const selectedItem = props.items.find(item => item.value = props.value);
  const shownText = selectedItem && selectedItem.text || '';
  return <div className="mdl-textfield mdl-js-textfield getmdl-select">
    <input className="mdl-textfield__input" value={shownText} type="text" id={props.id} readOnly={true} tabIndex="-1"
           data-val={props.value}/>

    <label htmlFor={props.id}>
      <i className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
    </label>

    <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu" htmlFor={props.id}>
      {props.items.map(item => {
        return <li className="mdl-menu__item" key={item.value} data-val={item.value}>{item.text}</li>
      })}
    </ul>
  </div>
};
