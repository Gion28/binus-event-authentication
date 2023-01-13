import express from 'express';
import user from './user';

const router = express.Router();

const indexRoutes = (app) => {
  app.use('/binus-event-api', router);
  router.use('/auth', user);
};

export default indexRoutes;
