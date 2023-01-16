import PenyelenggaraRepository from '../repositories/PenyelenggaraRepository';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import HttpMessageConstants from '../constants/HttpMessageConstants';

const { HTTP_STATUS_UNAUTHORIZED } = HttpStatusConstants;
const { WRONG_TOKEN } = HttpMessageConstants;
const {
  getAllDataPenyelenggara,
  doRegistrationDataPenyelenggara,
  uploadImageData,
  doLoginUserData,
  updateProfileDataByPenyelenggaraId,
  doResetPasswordData,
  addNewPasswordData,
  checkTokenData
} = PenyelenggaraRepository;

class PenyelenggaraService {
    static getAllData = async () => {
      return await getAllDataPenyelenggara();
    }

    static doRegistrationData = async (payload) => {
      return await doRegistrationDataPenyelenggara(payload);
    }

    static uploadImage = async (path, mimetype, penyelenggaraId) => {
      return await uploadImageData(path, mimetype, penyelenggaraId);
    }

    static doLoginUser = async (email, password, res) => {
      return await doLoginUserData(email, password, res);
    }

    static updateProfileDataByPenyelenggaraId = async (penyelenggaraId, payload) => {
      return await updateProfileDataByPenyelenggaraId(penyelenggaraId, payload);
    }

    static doResetPasswordData = async (email, res) => {
      return await doResetPasswordData(email, res);
    }

    static addNewPassword = async (password, token, res) => {
      return await addNewPasswordData(password, token, res);
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

export default PenyelenggaraService;
