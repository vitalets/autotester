
const Channel = require('chnl');
const state = require('../../state');
const {
  onSessionStarted,
  onTestsRun,
  onTestsDone,
} = require('../../controllers/internal-channels');

module.exports = class Status extends React.Component {
  constructor() {
    super();
    this.state = {
      done: false,
      sessionId: '',
      targetName: '',
      watchUrl: '',
      testsCount: 0,
    };
  }
  componentDidMount() {
    this._subscription = new Channel.Subscription([
      {channel: onTestsRun, listener: this.handleTestsRun.bind(this)},
      {channel: onTestsDone, listener: this.handleTestsDone.bind(this)},
      {channel: onSessionStarted, listener: this.handleSessionStart.bind(this)},
    ]).on();
  }
  componentWillUnmount() {
    this._subscription.off();
  }
  handleSessionStart({sessionId, target}) {
    this.setState({
      sessionId: sessionId,
      watchUrl: this.getWatchUrl(target.watchUrl, sessionId),
    });
  }
  handleTestsRun() {
    this.setState({
      done: false,
      targetName: state.selectedTarget.name,
      testsCount: state.files.length,
      sessionId: '',
      watchUrl: '',
    });
  }
  handleTestsDone() {
    this.setState({done: true});
  }
  getWatchUrl(watchUrlTpl, sessionId) {
    return watchUrlTpl && sessionId
      ? watchUrlTpl.replace(':sessionId', sessionId)
      : '';
  }
  render() {
    if (this.state.targetName) {
      return (
        <div style={{fontSize: '1.1em', marginBottom: '10px'}}>
          <div>
            Session on: <strong>{this.state.targetName}</strong>,
            tests: <strong>{this.state.testsCount}</strong>,
            id: {this.state.sessionId ? <strong>{this.state.sessionId}</strong> : <i>waiting...</i>}
            {this.state.watchUrl ? <span>, video: <a href={this.state.watchUrl}>watch</a></span> : null}
          </div>
          <div>
            Status: <strong>{this.state.done ? 'done' : 'running...'}</strong>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
};
