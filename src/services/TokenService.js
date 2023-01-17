import TokenRepository from '../repositories/TokenRepository';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import HttpMessageConstants from '../constants/HttpMessageConstants';

const { HTTP_STATUS_UNAUTHORIZED } = HttpStatusConstants;
const { WRONG_TOKEN } = HttpMessageConstants;
const { checkTokenData } = TokenRepository;

class TokenService {
    static checkTokenData = async (token, res) => {
      if (!token) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).send({
          error: WRONG_TOKEN
        });
      }
      return await checkTokenData(token, res);
    }
}

export default TokenService;
