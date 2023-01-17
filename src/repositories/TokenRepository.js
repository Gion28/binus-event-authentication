import jwt from 'jsonwebtoken';
import { isNull } from 'lodash';
import Mahasiswa from '../models/Mahasiswa';
import Penyelenggara from '../models/Penyelenggara';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import HttpMessageConstants from '../constants/HttpMessageConstants';

const { HTTP_STATUS_UNAUTHORIZED } = HttpStatusConstants;
const { INVALID_TOKEN, USER_NOT_FOUND } = HttpMessageConstants;

class TokenRepository {
  static checkTokenData = async (token, res) => {
    jwt.verify(token, process.env.SECRET, async (err, decode) => {
      if (err) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).send({
          error: INVALID_TOKEN
        });
      }

      const dataMahasiswa = await Mahasiswa.findById(decode._id, { image: 0 });

      const dataPenyelenggara = await Penyelenggara.findById(decode._id, { image: 0 });

      if (isNull(dataMahasiswa) && isNull(dataPenyelenggara)) {
        return res.status(401).send({
          error: USER_NOT_FOUND
        });
      }
      if (isNull(dataMahasiswa)) {
        return res.send(dataPenyelenggara);
      }
      return res.send(dataMahasiswa);
    });
  }
}

export default TokenRepository;
