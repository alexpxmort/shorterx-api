import supertest from 'supertest';
import { setupEnv } from './setupEnv';
import App from '@providers/express/app';
import { router } from '@providers/express/routes';

import { describe, it, expect } from '@jest/globals';

const app = new App();

const request = supertest(app.service);

app.setupRoutes(router);
app.afterProcessing({ no_logger: true });

setupEnv();

export { expect, describe, it, request };
