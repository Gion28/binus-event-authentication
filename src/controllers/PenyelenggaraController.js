import { validationResult } from 'express-validator';
import HttpStatusConstants from '../constants/HttpStatusConstants';
import httpMessageConstants from '../constants/HttpMessageConstants';
import PenyelenggaraService from '../services/PenyelenggaraService';

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = HttpStatusConstants;

const {
  SUCCESSFULLY_REGISTRATION,
  WRONG_INPUT_REGISTRATION,
  IMAGE_PROFILE_SUCCESSFULLY_UPLOADED,
  EMAIL_NOT_FOUND,
  EMAIL_PASSWORD_NOT_MATCH,
  SUCCESSFULLY_SIGNIN,
  USER_NOT_FOUND,
  UNABLE_UPDATE_USER,
  RESET_PASSWORD_SUCCESSFULLY,
  TOKEN_NOT_FOUND_EXPIRED,
  UNABLE_UPDATE_PASSWORD,
  PASSWORD_SUCCESSFULLY_RESET,
  UPDATE_PROFILE_SUCCESSFULY_UPDATED,
  EVENT_SUCCESSFULLY_DELETED,
  EVENT_SUCCESSFULLY_EDITED,
  WRONG_TOKEN,
  INVALID_TOKEN,
} = httpMessageConstants;

const {
  doRegistrationData
} = PenyelenggaraService;

class PenyelenggaraController {
    static doRegistration = async (req, res, next) => {
      const errors = validationResult(req);

      try {
        const registration = await doRegistrationData(
          errors, HTTP_STATUS_BAD_REQUEST, WRONG_INPUT_REGISTRATION, req, res
        );
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
}

export default PenyelenggaraController;
