import express from 'express';
import PenyelenggaraController from '../controllers/PenyelenggaraController';
import { upload } from '../middlewares/MulterHandler';
import JoiValidatorHandler from '../middlewares/JoiValidatorHandler';
import {
  CreatePenyelenggaraSchema,
  EditPenyelenggaraSchema
} from './schema/PenyelenggaraSchema';

const PenyelenggaraRoute = express.Router();

const {
  fetchAllData,
  doRegistration,
  uploadImageProfileData,
  doLogin,
  updateProfileByPenyelenggaraId,
  doResetPassword,
  createNewPassword,
  checkToken
} = PenyelenggaraController;

PenyelenggaraRoute.get('/penyelenggara', fetchAllData);
PenyelenggaraRoute.post('/registration', JoiValidatorHandler(CreatePenyelenggaraSchema), doRegistration);
PenyelenggaraRoute.post('/upload-profile', upload.single('image'), uploadImageProfileData);
PenyelenggaraRoute.post('/login', doLogin);
PenyelenggaraRoute.put('/update-profile/:penyelenggaraId', JoiValidatorHandler(EditPenyelenggaraSchema), updateProfileByPenyelenggaraId);
PenyelenggaraRoute.post('/reset-password', doResetPassword);
PenyelenggaraRoute.post('/new-password', createNewPassword);
PenyelenggaraRoute.post('/check-token', checkToken);

export default PenyelenggaraRoute;
