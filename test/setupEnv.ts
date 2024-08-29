import * as process from 'process';

const setupEnv = () => {
  process.env.PORT_NUMBER = '7000';
  process.env.COR_ORIGIN = '*';

  if (process.env.NODE_ENV !== 'test') {
    process.env.DATABASE_URL = 'database_url';
  }
};

export { setupEnv };
