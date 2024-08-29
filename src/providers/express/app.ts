import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Router } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { createNamespace } from 'cls-hooked';

import compression from 'compression';

import { loggerExpress } from '@ports/providers/logger';
import { sanitizeMiddleware } from './middlewares/sanitizeMiddleware';
import { tracking } from './middlewares/tracking';
import { errors } from './middlewares/errors';
import { clsCorrelationId } from './middlewares/mappedDiagnosticContext';
import swaggerDocument from '@docs/swagger.json';

export default class App {
  service: express.Express;

  constructor() {
    this.service = express();

    this.service.use(compression());
    this.service.use(bodyParser.json());
    this.service.use(sanitizeMiddleware);
    this.setupDocumentation();
    this.service.use(bodyParser.urlencoded({ extended: true, limit: '60mb' }));
    this.service.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'DELETE', 'PUT']
      })
    );
    this.service.use(tracking);

    this.service.disable('x-powered-by');

    const loggerNamespace = createNamespace('shorterx-apiSpace');
    this.service.use(clsCorrelationId(loggerNamespace));
  }

  setupRoutes(router: Router) {
    this.service.use('/', router);
  }

  async setupDocumentation() {
    this.service.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  afterProcessing(params: { no_logger: boolean } = { no_logger: false }) {
    this.service.use(errors);
    if (!params.no_logger) {
      this.service.use(loggerExpress);
    }
  }

  listen(port: number, callback: () => void) {
    this.service.listen(port, callback);
  }
}
