import express from 'express';
import mahasiswaRoute from './MahasiswaRoute';
import penyelenggaraRoute from './PenyelenggaraRoute';
import TokenController from '../controllers/TokenController';

const { checkToken } = TokenController;

const router = express.Router();

const indexRoutes = (app) => {
  app.use('/binus-event-api/auth', router);
  router.use('/mahasiswa', mahasiswaRoute);
  router.use('/penyelenggara', penyelenggaraRoute);
  router.post('/check-token', checkToken);
};

export default indexRoutes;
