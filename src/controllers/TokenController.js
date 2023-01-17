import TokenService from '../services/TokenService';

const { checkTokenData } = TokenService;

class TokenController {
    static checkToken = async (req, res, next) => {
      const token = req.header['x-access-token'] || req.body.token;

      try {
        await checkTokenData(token, res);
      } catch (error) {
        next(error);
      }
    }
}

export default TokenController;
