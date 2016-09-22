
const {Button} = require('react-mdl');
const {SETTINGS_MENU} = require('../store/constants');

const texts = {
  [SETTINGS_MENU.TESTS_SOURCE]: 'Tests source',
  [SETTINGS_MENU.HUBS]        : 'Hubs',
  [SETTINGS_MENU.TARGETS]     : 'Targets',
};

module.exports = function SettingsMenu(props) {
  return (
    <div className="settings-menu">
      {Object.keys(SETTINGS_MENU).map(key => {
        return (
          <Button
            key={key}
            primary={props.selected === key}
            onClick={() => props.onClick(key)}
          >{texts[key]}</Button>
        )
      })}
    </div>
  );
};
