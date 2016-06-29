/**
 * Custom global functions for testing
 */

const frontend = {
  clickSettings() {
    return page.click('.i-action__settings');
  },
  reload() {
    return page.navigate('chrome://newtab');
  }
};
