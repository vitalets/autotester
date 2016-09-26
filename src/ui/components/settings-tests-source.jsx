const {RadioGroup, Radio, Textfield} = require('react-mdl');
const debounce = require('lodash.debounce');
const mobx = require('mobx');
const {TESTS_SOURCE_TYPE} = require('../store/constants');
const store = require('../store').store;
const testsList = require('../controllers/tests-list');

module.exports = class SettingsTestsSource extends React.Component {
  constructor() {
    super();
    this.saveType = debounce(mobx.action(this.saveType.bind(this)), 500);
    this.saveUrl = debounce(mobx.action(this.saveUrl.bind(this)), 1000);
  }
  componentWillMount() {
    this.disposer = mobx.autorun(() => {
      this.setState({
        type: store.testsSourceType,
        url: store.testsSourceUrl,
        urlError: this.getUrlError(),
      });
    });
  }
  componentWillUnmount() {
    this.disposer();
  }
  getUrlError() {
    if (store.testsSourceType === TESTS_SOURCE_TYPE.URL && store.testsSourceUrl && !store.tests.length) {
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
    store.testsSourceType = this.state.type;
    if (store.testsSourceType !== TESTS_SOURCE_TYPE.SNIPPETS) {
      testsList.load();
    }
  }
  saveUrl() {
    if (store.testsSourceUrl === this.state.url) {
      return;
    } else {
      store.testsSourceUrl = this.state.url;
    }
    if (!store.testsSourceUrl) {
      store.clearTests();
    } else {
      testsList.load();
    }
  }
  render() {
    return (
      <div className="settings-tests-source">
        <RadioGroup name="testsSource"
                    value={this.state.type}
                    childContainer="div"
                    onChange={e => this.handleTypeChange(e)}>
          <Radio value={TESTS_SOURCE_TYPE.SNIPPETS} ripple>In-browser snippets</Radio>
          <Radio value={TESTS_SOURCE_TYPE.URL} ripple className="tests-source-url-radio">
            <span style={{paddingTop: '25px', float: 'left'}}>Remote URL</span>
            <Textfield
              onChange={e => this.handleUrlChange(e)}
              disabled={this.state.type !== TESTS_SOURCE_TYPE.URL}
              value={this.state.url}
              label="http://"
              error={this.state.urlError}
              className="tests-source-url-input"
            />
          </Radio>
          <Radio value={TESTS_SOURCE_TYPE.PACKED} ripple>Built-in</Radio>
        </RadioGroup>
      </div>
    );
  }
};
