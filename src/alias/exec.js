
module.exports = function exec(command, opt_options = {}) {
  const args = opt_options.args || [];
  console.info(`exec: ${command}`, args.join(' '));
  return new Command();
};

class Command {
  constructor() {
    this._result = new Promise(resolve => this._resolve = resolve);
  }
  result() {
    return this._result;
  }
  kill(opt_signal) {
    const exitCode = 0;
    this._resolve(new Result(exitCode, opt_signal || 'SIGTERM'))
  }
}

class Result {
  constructor(code, signal) {
    this.code = code;
    this.signal = signal;
  }
  toString() {
    return `Result(code=${this.code}, signal=${this.signal})`;
  }
}
