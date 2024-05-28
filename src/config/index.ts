const config = {
  log4js: {
    appenders: {
      console: {
        type: 'console',
      },
      ms: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        filename: 'log/ms',
        maxLogSize: 1000000,
        compress: true,
      },
    },
    categories: {
      default: {
        appenders: ['ms', 'console'],
        level: 'debug',
      },
    },
  },
  connection: {
    port: 3000,
    address: 'localhost',
  },
  mongodb: {
    address: 'mongodb://localhost:27017/reviews',
  },
  games_api: {
    url: 'http://localhost:8080/api/game',
}
};

export default config;
