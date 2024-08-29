import request from 'supertest';
import express from 'express';
import App from '@providers/express/app';

describe('App', () => {
  let app: App;
  let server: express.Express;

  beforeEach(() => {
    app = new App();
    server = app.service;
  });

  it('should use the sanitize middleware', async () => {
    const sanitizeMiddleware = jest.fn((req, res, next) => next());
    app.service.use(sanitizeMiddleware);

    app.listen(400, () => {
      console.log('test');
    });

    app.afterProcessing({ no_logger: false });

    await request(server).get('/some-endpoint');

    expect(sanitizeMiddleware).toHaveBeenCalled();
  });

  it('should call the tracking middleware', async () => {
    const tracking = jest.fn((req, res, next) => next());
    app.service.use(tracking);

    await request(server).get('/some-endpoint');

    expect(tracking).toHaveBeenCalled();
  });
});
