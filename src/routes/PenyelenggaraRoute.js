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
  fetchDetailPenyelenggara,
  doRegistration,
  uploadImageProfileData,
  doLogin,
  updateProfileByPenyelenggaraId,
  doResetPassword,
  createNewPassword
} = PenyelenggaraController;

PenyelenggaraRoute.get('/', fetchAllData);
PenyelenggaraRoute.get('/:penyelenggaraId', fetchDetailPenyelenggara);
PenyelenggaraRoute.post('/registration', JoiValidatorHandler(CreatePenyelenggaraSchema), doRegistration);
PenyelenggaraRoute.post('/upload-profile', upload.single('image'), uploadImageProfileData);
PenyelenggaraRoute.post('/login', doLogin);
PenyelenggaraRoute.put('/update-profile/:penyelenggaraId', JoiValidatorHandler(EditPenyelenggaraSchema), updateProfileByPenyelenggaraId);
PenyelenggaraRoute.post('/reset-password/:penyelenggaraId', doResetPassword);
PenyelenggaraRoute.post('/new-password/:token', createNewPassword);

export default PenyelenggaraRoute;
