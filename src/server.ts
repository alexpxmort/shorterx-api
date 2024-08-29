import { start } from '@ports/server';
import { logger } from '@ports/providers/logger';

start().then((result: string) => {
  logger.info(result);
});
