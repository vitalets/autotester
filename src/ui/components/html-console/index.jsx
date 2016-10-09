/**
 * React implementation of console messages
 */

require('./index.css');
const Channel = require('chnl');
const {onError, onConsoleMessage, onConsoleClear} = require('../../controllers/internal-channels');

module.exports = class HtmlConsole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
    };
  }

  componentDidMount() {
    this._subscription = new Channel.Subscription([
      {channel: onError, listener: this.onError.bind(this)},
      {channel: onConsoleMessage, listener: this.onConsoleMessage.bind(this)},
      {channel: onConsoleClear, listener: this.onConsoleClear.bind(this)},
    ]).on();
  }

  componentWillUnmount() {
    this._subscription.off();
  }

  onError(error) {
    const msg = error.stack || error.message || String(error);
    this.addLine({type: 'error', args: [msg]});
  }

  onConsoleMessage({type, args}) {
    this.addLine({type, args});
  }

  onConsoleClear() {
    this.setState({lines: []});
  }

  addLine({type, args}) {
    const lines = this.state.lines;
    lines.push({type, args});
    this.setState({lines});
  }

  render() {
    if (this.state.lines.length) {
      return (
        <pre className="console">
          {this.state.lines.map((line, index) => this.renderLine(line, index))}
        </pre>
      );
    } else {
      return null;
    }
  }

  renderLine(line, key) {
    return (
      <div key={key} className={'console-line-' + line.type}>
        {line.args.map((arg, index) => this.renderArg(arg, index))}
      </div>
    );
  }

  renderArg(arg, key) {
    const type = arg && arg.type || 'string';
    const text = typeof arg === 'string' ? arg : (arg && arg.text || '');
    const renderValue = isLink(text) ? this.renderLink(text) : text;
    return (
      <span key={key} className={'console-line-item-' + type}>{key > 0 ? ' ' : ''}{renderValue}</span>
    );
  }

  renderLink(url) {
    return (
      <a href={url}>{url}</a>
    );
  }
};

function isLink(str) {
  return /^(https?|chrome|chrome\-extension):\/\//.test(str);
}
