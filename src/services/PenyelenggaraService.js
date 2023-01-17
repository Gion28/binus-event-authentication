import PenyelenggaraRepository from '../repositories/PenyelenggaraRepository';

const {
  getAllDataPenyelenggara,
  doRegistrationDataPenyelenggara,
  uploadImageData,
  doLoginUserData,
  updateProfileDataByPenyelenggaraId,
  doResetPasswordData,
  addNewPasswordData
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

    static addNewPassword = async (password, confirmPassword, token, res) => {
      return await addNewPasswordData(password, confirmPassword, token, res);
    }
}

export default PenyelenggaraService;
