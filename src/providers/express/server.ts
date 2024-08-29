import { DEFAULT_PORT_NUMBER } from '@helpers/constants';
import App from './app';
import { router } from './routes';
import { logger } from '@ports/providers/logger';

export async function start(): Promise<string> {
  const strPort = process.env.PORT_NUMBER || DEFAULT_PORT_NUMBER;
  const port = Number.parseInt(strPort, 10);

  if (Number.isNaN(port)) {
    logger.error(`Missing or invalid PORT definition ${strPort} server`);
    process.exit(-1);
  }

  const app = new App();
  app.setupRoutes(router);

  //await app.setupDocumentation();
  app.afterProcessing();
  return new Promise((resolve) => {
    app.listen(port, () => {
      resolve(`Server is listening on port ${port}`);
    });
  });
}
