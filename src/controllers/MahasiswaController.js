import { validationResult } from 'express-validator';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import httpMessageConstants from '../constants/HttpMessageConstants';
import MahasiswaService from '../services/MahasiswaService';

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST
} = HttpStatusConstants;

const {
  SUCCESSFULLY_REGISTRATION,
  IMAGE_PROFILE_SUCCESSFULLY_UPLOADED,
  UPDATE_PROFILE_SUCCESSFULY
} = httpMessageConstants;

const {
  getAllData,
  getMahasiswaDetail,
  doRegistrationData,
  uploadImage,
  doLoginUser,
  updateProfileDataByMahasiswaId,
  doResetPasswordData,
  addNewPassword
} = MahasiswaService;

class MahasiswaController {
  static fetchAllData = async (req, res, next) => {
    try {
      const mahasiswaList = await getAllData();
      res.status(HTTP_STATUS_OK).send(mahasiswaList);
    } catch (error) {
      next(error);
    }
  }

  static fetchDetailMahasiswa = async (req, res, next) => {
    const { mahasiswaId } = req.params;

    try {
      const mahasiswaDetail = await getMahasiswaDetail(mahasiswaId);
      res.status(HTTP_STATUS_OK).send(mahasiswaDetail);
    } catch (error) {
      next(error);
    }
  }

  static doRegistration = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        error: errors.array()[0].msg
      });
    }
    try {
      const registration = await doRegistrationData(req.body);
      res
        .status(HTTP_STATUS_OK)
        .json({
          message: SUCCESSFULLY_REGISTRATION,
          data: registration
        });
    } catch (error) {
      next(error);
    }
  }

  static uploadImageProfileData = async (req, res, next) => {
    const { path, mimetype } = req.file;
    const { mahasiswaId } = req.body;

    try {
      await uploadImage(path, mimetype, mahasiswaId);
      res
        .status(HTTP_STATUS_OK)
        .json({
          message: IMAGE_PROFILE_SUCCESSFULLY_UPLOADED
        });
    } catch (error) {
      next(error);
    }
  }

  static doLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      await doLoginUser(email, password, res);
    } catch (error) {
      next(error);
    }
  }

  static updateProfileByMahasiswaId = async (req, res, next) => {
    const { mahasiswaId } = req.params;

    try {
      await updateProfileDataByMahasiswaId(mahasiswaId, req.body);
      res
        .status(HTTP_STATUS_OK)
        .json({
          message: UPDATE_PROFILE_SUCCESSFULY
        });
    } catch (error) {
      next(error);
    }
  }

  static doResetPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
      await doResetPasswordData(email, res);
    } catch (error) {
      next(error);
    }
  }

  static createNewPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
      await addNewPassword(password, confirmPassword, token, res);
    } catch (error) {
      next(error);
    }
  }
}

export default MahasiswaController;
