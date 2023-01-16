import Penyelenggara from '../models/Penyelenggara';

class PenyelenggaraRepository {
    static doRegistrationDataUser = async (
      errors, HTTP_STATUS_BAD_REQUEST, WRONG_INPUT_REGISTRATION, req, res
    ) => {
      const penyelenggaraData = new Penyelenggara(req.body);
      penyelenggaraData.save((err, user) => {
        if (err) {
          return res.status(HTTP_STATUS_BAD_REQUEST).json({
            error: WRONG_INPUT_REGISTRATION
          });
        }
        return user;
      });
    }
}

export default PenyelenggaraRepository;
