import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import config from './config/config.js';
import routes from './routes/routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api', routes);

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/health', (req, res) => {
  res
  .status(200)
  .json({ status: "OK", uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

export default app;