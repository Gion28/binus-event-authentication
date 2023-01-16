import PenyelenggaraRepository from '../repositories/PenyelenggaraRepository';

const { doRegistrationDataUser } = PenyelenggaraRepository;
class PenyelenggaraService {
    static doRegistrationData = async (
      errors, HTTP_STATUS_BAD_REQUEST, WRONG_INPUT_REGISTRATION, req, res
    ) => {
      if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({
          error: errors.array()[0].msg
        });
      }
      return await doRegistrationDataUser(errors, HTTP_STATUS_BAD_REQUEST, req, res);
    }
}

export default PenyelenggaraService;
