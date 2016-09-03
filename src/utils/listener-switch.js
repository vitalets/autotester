/**
 * Class allowing to easily attach/detach listeners to event channel
 * Example:
 *
 * this._listeners = new ListenerSwitch([
 *   [chrome.tabs.onUpdated, this._onTabUpdated],
 *   [button, 'click', this._onButtonClick]
 * ], this);
 * ...
 * this._listeners.on();
 * ...
 * this._listeners.off();
 *
 */

class ListenerSwitch {
  /**
   *
   * @param {Array} config list of [channel, listener] OR [channel, event, listener]
   * @param {Object} [context] context to bind listener
   */
  constructor(config, context) {
    this._config = config.map(item => {
      const result = {
        channel: item[0],
        event: typeof item[1] === 'string' ? item[1] : null,
        listener: typeof item[1] === 'string' ? item[2] : item[1],
        on: false,
      };
      if (context) {
        result.listener = result.listener.bind(context);
      }
      return result;
    });
  }

  on() {
    this._config.forEach(item => this._onListener(item));
    return this;
  }

  off() {
    this._config.forEach(item => this._offListener(item));
    return this;
  }

  _onListener(item) {
    if (!item.on) {
      const method = item.channel.addListener || item.channel.addEventListener || item.channel.on;
      this._apply(method, item);
      item.on = true;
    }
  }

  _offListener(item) {
    if (item.on) {
      const method = item.channel.removeListener || item.channel.removeEventListener || item.channel.off;
      this._apply(method, item);
      item.on = false;
    }
  }

  _apply(method, item) {
    const args = item.event ? [item.event, item.listener] : [item.listener];
    method.apply(item.channel, args);
  }

}

module.exports = ListenerSwitch;
