import express from 'express';
import mahasiswaRoute from './MahasiswaRoute';
import penyelenggaraRoute from './PenyelenggaraRoute';

const router = express.Router();

const indexRoutes = (app) => {
  app.use('/binus-event-api/auth', router);
  router.use('/mahasiswa', mahasiswaRoute);
  router.use('/penyelenggara', penyelenggaraRoute);
};

export default indexRoutes;
