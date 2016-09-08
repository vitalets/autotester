/**
 * Easily attach/detach listeners to event channel
 * Example:
 *
 * this._listeners = new Subscription([
 *   {channel: chrome.tabs.onUpdated, listener: this._onTabUpdated.bind(this)},
 *   {channel: button, event: 'click', listener: this._onButtonClick.bind(this)}
 * ]);
 * ...
 * this._listeners.on();
 * ...
 * this._listeners.off();
 *
 */

class Subscription {
  /**
   *
   * @param {Array<{channel, event, listener}>} items
   */
  constructor(items) {
    this._items = items.map(item => {
      assertSubscription(item);
      item.on = false;
      return item;
    });
  }

  on() {
    this._items.forEach(item => this._itemOn(item));
    return this;
  }

  off() {
    this._items.forEach(item => this._itemOff(item));
    return this;
  }

  _itemOn(item) {
    if (!item.on) {
      const method = item.channel.addListener || item.channel.addEventListener || item.channel.on;
      this._apply(method, item);
      item.on = true;
    }
  }

  _itemOff(item) {
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

function assertSubscription(subscription) {
  if (!subscription.channel || typeof subscription.channel !== 'object') {
    throw new Error('Channel shoud be object');
  }
  if (subscription.event && typeof subscription.event !== 'string') {
    throw new Error('Event shoud be string');
  }
  if (!subscription.listener || typeof subscription.listener !== 'function') {
    throw new Error('Listener shoud be function');
  }
}

module.exports = Subscription;
