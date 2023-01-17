import MahasiswaRepository from '../repositories/MahasiswaRepository';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import HttpMessageConstants from '../constants/HttpMessageConstants';

const { HTTP_STATUS_UNAUTHORIZED } = HttpStatusConstants;
const { WRONG_TOKEN } = HttpMessageConstants;
const {
  getAllDataMahasiswa,
  doRegistrationDataMahasiswa,
  uploadImageData,
  doLoginUserData,
  updateProfileDataByMahasiswaId,
  doResetPasswordData,
  addNewPasswordData,
  checkTokenData
} = MahasiswaRepository;

class MahasiswaService {
    static getAllData = async () => {
      return await getAllDataMahasiswa();
    }

    static doRegistrationData = async (payload) => {
      return await doRegistrationDataMahasiswa(payload);
    }

    static uploadImage = async (path, mimetype, mahasiswaId) => {
      return await uploadImageData(path, mimetype, mahasiswaId);
    }

    static doLoginUser = async (email, password, res) => {
      return await doLoginUserData(email, password, res);
    }

    static updateProfileDataByMahasiswaId = async (mahasiswaId, payload) => {
      return await updateProfileDataByMahasiswaId(mahasiswaId, payload);
    }

    static doResetPasswordData = async (email, res) => {
      return await doResetPasswordData(email, res);
    }

    static addNewPassword = async (password, confirmPassword, token, res) => {
      return await addNewPasswordData(password, confirmPassword, token, res);
    }

    static checkTokenData = async (token, res) => {
      if (!token) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).send({
          error: WRONG_TOKEN
        });
      }
      return await checkTokenData(token, res);
    }
}

export default MahasiswaService;
