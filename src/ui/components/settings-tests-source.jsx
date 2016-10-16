const {RadioGroup, Radio, Textfield} = require('react-mdl');
const debounce = require('lodash.debounce');
const mobx = require('mobx');
const {FILES_SOURCE_TYPE, APP_STATE} = require('../state/constants');
const state = require('../state');
const testsList = require('../controllers/tests-list');

module.exports = class SettingsTestsSource extends React.Component {
  constructor() {
    super();
    this.state = {
      type: '',
      url: '',
      urlError: '',
    };
    this.saveType = debounce(mobx.action(this.saveType.bind(this)), 500);
    this.saveUrl = debounce(mobx.action(this.saveUrl.bind(this)), 1000);
  }
  componentDidMount() {
    this.disposer = mobx.autorun(() => {
      this.setState({
        type: state.filesSourceType,
        url: state.filesSourceUrl,
        urlError: this.getUrlError(),
      });
    });
  }
  componentWillUnmount() {
    this.disposer();
  }
  getUrlError() {
    if (state.filesSourceType === FILES_SOURCE_TYPE.URL && state.filesSourceUrl && !state.files.length) {
      return 'can not load tests from that url';
    } else {
      return '';
    }
  }
  handleTypeChange(e) {
    this.setState({type: e.target.value});
    this.saveType();
  }
  handleUrlChange(e) {
    this.setState({url: e.target.value, urlError: ''});
    this.saveUrl();
  }
  saveType() {
    state.filesSourceType = this.state.type;
    if (state.filesSourceType !== FILES_SOURCE_TYPE.INNER) {
      this.loadTests();
    }
  }
  saveUrl() {
    if (state.filesSourceUrl === this.state.url) {
      return;
    } else {
      state.filesSourceUrl = this.state.url;
    }
    if (!state.filesSourceUrl) {
      state.clearTests();
    } else {
      this.loadTests();
    }
  }
  loadTests() {
    state.appState = APP_STATE.LOADING;
    testsList.load()
      .then(() => state.appState = APP_STATE.READY);
  }
  render() {
    return (
      <div className="settings-tests-source">
        <RadioGroup name="testsSource"
                    value={this.state.type}
                    childContainer="div"
                    onChange={e => this.handleTypeChange(e)}>
          <Radio value={FILES_SOURCE_TYPE.INNER} ripple>In-browser snippets</Radio>
          <Radio value={FILES_SOURCE_TYPE.URL} ripple className="tests-source-url-radio">
            <span style={{paddingTop: '25px', float: 'left'}}>Remote URL</span>
            <Textfield
              onChange={e => this.handleUrlChange(e)}
              disabled={this.state.type !== FILES_SOURCE_TYPE.URL}
              value={this.state.url}
              label="http://"
              error={this.state.urlError}
              className="tests-source-url-input"
            />
          </Radio>
          <Radio value={FILES_SOURCE_TYPE.BUILT_IN} ripple>Built-in</Radio>
        </RadioGroup>
      </div>
    );
  }
};
