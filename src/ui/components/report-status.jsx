
const Channel = require('chnl');
const store = require('../store').store;
const {
  onSessionStarted,
  onTestsRun,
} = require('../controllers/internal-channels');

module.exports = class ReportStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionId: '',
      targetName: '',
      watchUrl: '',
      testsCount: 0,
    };
  }
  componentDidMount() {
    this._subscription = new Channel.Subscription([
      {channel: onTestsRun, listener: this.handleTestsRun.bind(this)},
      {channel: onSessionStarted, listener: this.handleSessionStart.bind(this)},
    ]).on();
  }
  componentWillUnmount() {
    this._subscription.off();
  }
  handleSessionStart({sessionId, target}) {
    this.setState({
      sessionId: sessionId,
      targetName: target.name,
      watchUrl: this.getWatchUrl(target.watchUrl, sessionId),
    });
  }
  handleTestsRun() {
    this.setState({
      sessionId: '',
      testsCount: store.isSnippets() ? store.snippets.length : store.tests.length,
    });
  }
  getWatchUrl(watchUrlTpl, sessionId) {
    return watchUrlTpl && sessionId
      ? watchUrlTpl.replace(':sessionId', sessionId)
      : '';
  }
  render() {
    if (this.state.sessionId) {
      return (
        <div style={{fontSize: '1.1em'}}>
          <span>Session on: <strong>{this.state.targetName}</strong>,
            tests: <strong>{this.state.testsCount}</strong>,
            id: <strong>{this.state.sessionId}</strong>
            {this.state.watchUrl ? <span>, video: <a href={this.state.watchUrl}>watch</a></span> : null}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }
};
