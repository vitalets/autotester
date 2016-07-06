/**
 * Base request catcher
 */

class BaseRequestCatcher {
  constructor() {
    this._requests = [];
    this._target = null;
    this._attached = false;
    this._started = false;
    this._handler = this._handler.bind(this);
    this._alwaysListen();
  }
  attach(target) {
    if (this._isSameTarget(target) && this._attached) {
      return Promise.resolve();
    }
    return Promise.resolve()
      .then(() => this._attached ? this.detach() : null)
      .then(() => this._target = target)
      .then(() => this._attach())
      .then(() => this._attached = true);
  }
  start(filter) {
    if (!this._attached) {
      throw new Error('Can not start catcher that is not attached');
    }
    this._requests.length = 0;
    this._filter = filter instanceof RequestFilter ? filter : new RequestFilter(filter);
    return Promise.resolve()
      .then(() => this._start())
      .then(() => this._started = true);
  }
  stop() {
    this._started = false;
    this._stop();
    return this._requests;
  }
  detach() {
    return Promise.resolve()
      .then(() => this._detach())
      .then(() => {
        this._attached = false;
        this._target = null;
      });
  }
  _pushRequest(request) {
    if (this._filter.match(request)) {
      this._requests.push(request);
    }
  }
  _alwaysListen() {

  }
  _attach() {

  }
  _start() {

  }
  _stop() {

  }
  _detach() {

  }
  _handler() {

  }
  _isSameTarget(target) {

  }
}
