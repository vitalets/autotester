const {RadioGroup, Radio, Textfield} = require('react-mdl');
const debounce = require('lodash.debounce');
const mobx = require('mobx');
const {FILES_SOURCE_TYPE} = require('../../state/constants');
const state = require('../../state');

module.exports = class FilesSource extends React.Component {
  constructor() {
    super();
    this.state = {
      type: '',
      url: '',
      path: '',
    };
    this.saveType = debounce(mobx.action(this.saveType.bind(this)), 500);
    this.saveUrl = debounce(mobx.action(this.saveUrl.bind(this)), 1000);
  }
  componentDidMount() {
    this.disposer = mobx.autorun(() => {
      this.setState({
        type: state.filesSourceType,
        url: state.selectedProject.filesSource.url,
        path: state.selectedProject.filesSource.path,
      });
    });
  }
  componentWillUnmount() {
    this.disposer();
  }
  handleTypeChange(e) {
    this.setState({type: e.target.value});
    this.saveType();
  }
  handleUrlChange(e) {
    this.setState({url: e.target.value});
    this.saveUrl();
  }
  saveType() {
    state.filesSourceType = this.state.type;
  }
  saveUrl() {
    state.selectedProject.filesSource.url = this.state.url;
  }
  render() {
    return (
      <div className="settings-tests-source">
        <RadioGroup name="testsSource"
                    value={this.state.type}
                    childContainer="div"
                    onChange={e => this.handleTypeChange(e)}>
          <Radio value={FILES_SOURCE_TYPE.INNER} ripple>In-browser</Radio>
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
