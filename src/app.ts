import express from 'express';
import routers from './routers';
import config from './config';
import log4js, { Configuration } from 'log4js';
import mongoose, { ConnectOptions } from 'mongoose';

export default async () => {
  const app = express();

  log4js.configure(config.log4js as Configuration);

  app.disable('etag');

  app.use(express.json({ limit: '1mb' }));

  app.use((req, _, next) => {
    if (req.body && typeof req.body.publishedAt === 'string') {
      const parsedDate = new Date(req.body.publishedAt);
      if (!isNaN(parsedDate.getTime())) {
        req.body.publishedAt = parsedDate;
      }
    }
    next();
  });

  app.use('/', routers);

  const port = config.connection.port;
  const address = config.connection.address;

  app.listen(port, address, () => {
    log4js.getLogger().info(`Reviews app listening on port ${address}:${port}`);
  });

  const mongoAddress = config.mongodb.address;
  await mongoose.connect(mongoAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
  } as ConnectOptions);

  return app;
};
