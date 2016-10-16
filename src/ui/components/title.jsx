/**
 * Manage title text
 */

const Channel = require('chnl');
const {observer} = require('mobx-react');
const state = require('../state');
const {APP_STATE} = require('../state/constants');
const {onFileStarted, onTestStarted, onTestsDone} = require('../controllers/internal-channels');

const TITLE_PREFIX = chrome.runtime.getManifest().name;

const MSG = {
  LOADING: 'loading...',
  READY: 'ready',
  RUNNING: 'running...',
  RUNNING_FILE: 'running file #{i}...',
  RUNNING_TEST: 'running test #{i}...',
  DONE: 'done',
};

module.exports = observer(class Title extends React.Component {
  constructor() {
    super();
    this.state = {
      runningFileIndex: null,
      runningTestIndex: null,
    };
  }
  componentDidMount() {
    this._subscription = new Channel.Subscription([
      {channel: onFileStarted, listener: this.onFileStarted.bind(this)},
      {channel: onTestStarted, listener: this.onTestStarted.bind(this)},
      {channel: onTestsDone, listener: this.onTestsDone.bind(this)},
    ]).on();
  }
  componentWillUnmount() {
    this._subscription.off();
  }
  onFileStarted(data) {
    this.setState({
      runningFileIndex: data.index,
      runningTestIndex: null,
    });
  }
  onTestStarted(data) {
    this.setState({
      runningFileIndex: null,
      runningTestIndex: data.index,
    });
  }
  onTestsDone() {
    this.setState({
      runningFileIndex: null,
      runningTestIndex: null,
    });
  }
  getMessage() {
    switch (state.appState) {
      case APP_STATE.LOADING: return MSG.LOADING;
      case APP_STATE.READY: return MSG.READY;
      case APP_STATE.TESTS_RUNNING: return this.getRunningTitle();
      case APP_STATE.TESTS_DONE: return MSG.DONE;
      default:
        return '';
    }
  }
  getRunningTitle() {
    if (typeof this.state.runningFileIndex === 'number') {
      return MSG.RUNNING_FILE.replace('{i}', this.state.runningFileIndex + 1);
    } else if (typeof this.state.runningTestIndex === 'number') {
      return MSG.RUNNING_TEST.replace('{i}', this.state.runningTestIndex + 1);
    } else {
      return MSG.RUNNING;
    }
  }
  render() {
    const msg = this.getMessage();
    document.title = TITLE_PREFIX + (msg ? ': ' + msg : '');
    return null;
  }
});
