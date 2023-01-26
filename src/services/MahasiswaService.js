import MahasiswaRepository from '../repositories/MahasiswaRepository';

const {
  getAllDataMahasiswa,
  getMahasiswaDetailData,
  doRegistrationDataMahasiswa,
  uploadImageData,
  doLoginUserData,
  updateProfileDataByMahasiswaId,
  doResetPasswordData,
  addNewPasswordData
} = MahasiswaRepository;

class MahasiswaService {
    static getAllData = async () => {
      return await getAllDataMahasiswa();
    }

    static getMahasiswaDetail = async (mahasiswaId) => {
      return await getMahasiswaDetailData(mahasiswaId);
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

    static doResetPasswordData = async (email, mahasiswaId, res) => {
      return await doResetPasswordData(email, mahasiswaId, res);
    }

    static addNewPassword = async (password, confirmPassword, token, res) => {
      return await addNewPasswordData(password, confirmPassword, token, res);
    }
}

export default MahasiswaService;
