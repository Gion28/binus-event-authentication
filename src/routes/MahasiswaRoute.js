import express from 'express';
import MahasiswaController from '../controllers/MahasiswaController';
import { upload } from '../middlewares/MulterHandler';
import JoiValidatorHandler from '../middlewares/JoiValidatorHandler';
import {
  CreateMahasiswaSchema,
  EditMahasiswaSchema
} from './schema/MahasiswaSchema';

const MahasiswaRoute = express.Router();

const {
  fetchAllData,
  fetchDetailMahasiswa,
  doRegistration,
  uploadImageProfileData,
  doLogin,
  updateProfileByMahasiswaId,
  doResetPassword,
  createNewPassword
} = MahasiswaController;

MahasiswaRoute.get('/', fetchAllData);
MahasiswaRoute.get('/:mahasiswaId', fetchDetailMahasiswa);
MahasiswaRoute.post('/registration', JoiValidatorHandler(CreateMahasiswaSchema), doRegistration);
MahasiswaRoute.post('/upload-profile', upload.single('image'), uploadImageProfileData);
MahasiswaRoute.post('/login', doLogin);
MahasiswaRoute.put('/update-profile/:mahasiswaId', JoiValidatorHandler(EditMahasiswaSchema), updateProfileByMahasiswaId);
MahasiswaRoute.post('/reset-password', doResetPassword);
MahasiswaRoute.post('/new-password/:token', createNewPassword);

export default MahasiswaRoute;
