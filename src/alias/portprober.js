
const logger = require('../utils/logger').create('Alias portprober');

exports.findFreePort = function () {
  logger.info('Portprober.findFreePort! Do we really need this?');
  return 9515;
};
