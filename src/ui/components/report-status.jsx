
const {onSessionStarted} = require('../controllers/internal-channels');

module.exports = class ReportStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionId: '',
      targetName: '',
      watchUrl: '',
    };
  }
  componentDidMount() {
    onSessionStarted.addListener(this.handleSessionStart, this);
  }
  componentWillUnmount() {
    onSessionStarted.removeListener(this.handleSessionStart, this);
  }
  handleSessionStart({sessionId, target}) {
    this.setState({
      sessionId: sessionId,
      targetName: target.name,
      watchUrl: this.getWatchUrl(target.watchUrl, sessionId),
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
