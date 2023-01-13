import morgan from 'morgan';
import logger from '../../config/logger/ampLog';

/**
 * Configure logger to write log
 */
const loggerHandler = (app) => {
    const originalSend = app.response.send;
    // eslint-disable-next-line no-param-reassign
    app.response.send = function sendOverWrite(body) {
        originalSend.call(this, body);
        this.morgan_body_response = body;
    };

    morgan.token('req-body', (req) => {
        return JSON.stringify(req.body) && JSON.stringify(req.body).replace(/["]/g, '\'');
    });
    morgan.token('res-body', (req, res) => {
        return res.morgan_body_response.replace(/["]/g, '\'');
    });

    return morgan(':method :url :date[web] :status :user-agent :response-time ms request-body: :req-body - response-body: :res-body', { immediate: false, stream: logger.stream });
};

export default loggerHandler;
