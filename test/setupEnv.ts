import { DEFAULT_PORT_NUMBER } from '@helpers/constants';
import * as process from 'process';

const setupEnv = () => {
  process.env.PORT_NUMBER = DEFAULT_PORT_NUMBER;
  process.env.COR_ORIGIN = '*';

  if (process.env.NODE_ENV !== 'test') {
    process.env.DATABASE_URL = 'database_url';
  }
};

export { setupEnv };
