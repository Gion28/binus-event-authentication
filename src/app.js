import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import swaggerDocs from './utils/SwaggerUtils';
import loggerHandler from './middlewares/LoggerHandler';
import errorHandler from './middlewares/ErrorHandler';
import indexRoutes from './routes';

require('dotenv').config();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Use parsing middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
app.use(express.json(), loggerHandler(app));
app.use(errorHandler);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Set EJS as templating engine
app.set('view engine', 'ejs');

indexRoutes(app);

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database Connected');
  })
  .catch(() => {
    console.log('Unable to connect to Database!');
  });

// PORT
const port = process.env.PORT || 8081;

// Listening
const server = http.createServer(app);

server.listen(port);

const shutdownProcess = () => {
  // eslint-disable-next-line no-console
  server.close(() => {
    // eslint-disable-next-line no-console
    process.exit(0);
  });
};

process.on('SIGTERM', shutdownProcess);
process.on('SIGINT', shutdownProcess);
