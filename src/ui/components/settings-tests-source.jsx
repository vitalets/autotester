const {observer} = require('mobx-react');
const {RadioGroup, Radio, Textfield} = require('react-mdl');
const {TESTS_SOURCE_TYPE} = require('../store/constants');
const mobx = require('mobx');
const store = require('../store').store;

module.exports = observer(class SettingsTestsSource extends React.Component {
  constructor() {
    super();
    this.handleTypeChange = mobx.action(this.handleTypeChange.bind(this));
    this.handleUrlChange = mobx.action(this.handleUrlChange.bind(this));
  }
  handleTypeChange(e) {
    store.testsSourceType = e.target.value;
  }
  handleUrlChange(e) {
    store.testsSourceUrl = e.target.value;
  }
  render() {
    return (
      <div className="settings-tests-source">
        <RadioGroup name="testsSource" value={store.testsSourceType} childContainer="div"
                    onChange={this.handleTypeChange}>
          <Radio value={TESTS_SOURCE_TYPE.SNIPPETS} ripple>In-extension snippets</Radio>
          <Radio value={TESTS_SOURCE_TYPE.URL} ripple className="tests-source-url-radio">
            <span style={{paddingTop: '25px', float: 'left'}}>Remote URL</span>
            <Textfield
              onChange={this.handleUrlChange}
              disabled={store.testsSourceType !== TESTS_SOURCE_TYPE.URL}
              value={store.testsSourceUrl}
              label="http://"
              className="tests-source-url-input"
            />
          </Radio>
          <Radio value={TESTS_SOURCE_TYPE.PACKED} ripple disabled>Packed</Radio>
        </RadioGroup>
      </div>
    );
  }
});
