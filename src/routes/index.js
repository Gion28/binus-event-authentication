import express from 'express';
import user from './user';
import penyelenggaraRoute from './PenyelenggaraRoute';

const router = express.Router();

const indexRoutes = (app) => {
  app.use('/binus-event-api/auth', router);
  router.use('/mahasiswa', user);
  router.use('/penyelenggara', penyelenggaraRoute);
};

export default indexRoutes;
