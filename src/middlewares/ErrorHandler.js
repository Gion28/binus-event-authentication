import httpMessageConstants from '../constants/HttpMessageConstants';
import httpStatusConstants from '../constants/HttpStatusConstants';

const { INTERNAL_SERVER_ERROR_MESSAGE } = httpMessageConstants;
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = httpStatusConstants;

/*
  Error handler middleware
 */
const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.status || HTTP_STATUS_INTERNAL_SERVER_ERROR);
    return res.json({
        status: error.status || HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: error.message || INTERNAL_SERVER_ERROR_MESSAGE
    });
};

export default errorHandler;
