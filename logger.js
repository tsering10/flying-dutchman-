var bunyan = require('bunyan'),

  // TODO default.
  defaults = {},

  // singleton
  logger,

  createLogger = function createLogger() {


    if (logger) {
      return logger;
    }

   logger = bunyan.createLogger({
        name: 'Yuzu',
        streams: [{
            type: 'rotating-file',
            path: 'yuzu.log',
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }]
    });

    return logger;
  };

module.exports = createLogger;