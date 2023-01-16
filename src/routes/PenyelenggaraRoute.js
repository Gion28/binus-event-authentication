import express from 'express';
import { check } from 'express-validator';
import PenyelenggaraController from '../controllers/PenyelenggaraController';
import { upload } from '../middlewares/MulterHandler';
import JoiValidatorHandler from '../middlewares/JoiValidatorHandler';
import { PenyelenggaraSchema } from './schema/PenyelenggaraSchema';

const PenyelenggaraRoute = express.Router();

const {
  doRegistration,
  uploadImageProfileData,
  updateProfileByUserId,
  doLogin,
  doResetPassword,
  createNewPassword,
  checkToken
} = PenyelenggaraController;

PenyelenggaraRoute.post('/registration', JoiValidatorHandler(PenyelenggaraSchema), doRegistration);
PenyelenggaraRoute.post('/upload-profile', upload.single('image'), uploadImageProfileData);
PenyelenggaraRoute.put('/update-profile/:penyelenggaraId', JoiValidatorHandler(PenyelenggaraSchema), updateProfileByUserId);
PenyelenggaraRoute.post('/login', doLogin);
PenyelenggaraRoute.post('/reset-password', doResetPassword);
PenyelenggaraRoute.post('/new-password', createNewPassword);
PenyelenggaraRoute.post('/check-token', checkToken);
